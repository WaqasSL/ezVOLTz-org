import sharp from 'sharp';
import crypto from 'crypto';
import { errorMessage, s3Client } from '../../config/config.js';
import Review from '../../models/ReviewModel.js';
import User from '../../models/UserModel.js';
import {
  addReviewSchema,
  udpateReviewSchema,
} from '../../schema/review/reviewSchema.js';
import Reply from '../../models/ReplyModel.js';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { uploadImages } from '../../routes/review.js';

const bucketName = process.env.S3_BUCKET_NAME;

export const getAllReviewsByStation = async (req, res) => {
  const { stationId, stationType } = req.params;
  const { page, limit } = req.query;
  try {
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    const count = await Review.countDocuments({ stationId, stationType });

    const totalPages = Math.ceil(count / pageSize);
    const skip = (pageNumber - 1) * pageSize;

    const reviewsAvg = await Review.aggregate([
      {
        $match: {
          stationId,
          $and: [{ stationType }],
        },
      },
      {
        $group: {
          _id: null,
          averageField: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    const reviews = await Review.aggregate([
      {
        $match: {
          stationId,
          $and: [{ stationType }],
        },
      },
      {
        $lookup: {
          from: 'replies',
          localField: '_id',
          foreignField: 'reviewId',
          as: 'reply',
          pipeline: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },
    ]);

    res.status(200).send({
      reviews,
      currentPage: pageNumber,
      totalPages: totalPages,
      reviewsAverage: {
        average: reviewsAvg[0]?.averageField?.toFixed(1),
        count: reviewsAvg[0]?.count,
      },
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getReviewsById = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findOne({
      _id: reviewId,
    });

    res.status(200).send({
      review,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const addReview = async (req, res) => {
  try {
    uploadImages(req, res, async function (err) {
      if (err) {
        return res.status(400).send({ error: err.message });
      }

      //Check the file
      if (req.file) {
        // Check the MIME type (allow any image MIME type)
        if (!req.file.mimetype.startsWith('image/'))
          return res.status(400).send({
            error: 'File type not supported. Please upload an image.',
          });

        if (req.file.size > 10485760)
          return res.status(400).send({
            error: 'File size too large. Maximum size should be 10MB.',
          });
      }

      let reviewImages = [];
      await addReviewSchema.validate(req.body);
      const user = await User.findOne({ _id: req.body?.userId });
      if (!user)
        return res.status(404).send({
          error:
            'Your account not exist. If you want to give review then create your account first.',
        });
      for (var i = 0; i < req.files.length; i++) {
        const fileName = crypto.randomBytes(32).toString('hex');
        const buffer = await sharp(req.files[i].buffer)
          .resize({
            width: 520,
            height: 520,
            fit: 'contain',
          })
          .png()
          .toBuffer();
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: `reviews/${fileName}`,
          Body: buffer,
          ContentType: req.files[i].mimetype,
        });
        await s3Client.send(command);
        reviewImages.push(
          `${process.env.S3_BUCKET_ACCESS_URL}reviews/${fileName}`
        );
      }
      const body = req.body;
      delete body.userId;
      const review = await Review.create({
        ...req.body,
        images: reviewImages,
        user: {
          name: user?.name,
          profileImage: user?.profileImage || null,
          userId: user?._id,
        },
      });
      if (!review)
        return res
          .status(500)
          .send({ error: 'Something went wrong please try again.' });

      res.status(201).send({ message: 'Your review has been submited.' });
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const uploadReviewImages = async (req, res) => {
  try {
    uploadImages(req, res, async function (err) {
      if (err) {
        return res.status(400).send({ error: err.message });
      }

      //Check the file
      if (req.file) {
        // Check the MIME type (allow any image MIME type)
        if (!req.file.mimetype.startsWith('image/'))
          return res.status(400).send({
            error: 'File type not supported. Please upload an image.',
          });

        if (req.file.size > 10485760)
          return res.status(400).send({
            error: 'File size too large. Maximum size should be 10MB.',
          });
      }

      const { reviewId, userId } = req.body;

      let reviewImages = [];
      const user = await User.findOne({ _id: userId });
      if (!user)
        return res.status(404).send({
          error:
            'Your account not exist. If you want to give review then create your account first.',
        });
      const review = await Review.findOne({
        _id: reviewId,
        'user.userId': userId,
      });
      if (!review)
        return res.status(404).send({
          error: 'No review found againts your record.',
        });
      if (req?.files?.length <= 0)
        return res.status(400).send({
          error: 'No image found.',
        });
      for (var i = 0; i < req?.files?.length; i++) {
        const fileName = crypto.randomBytes(32).toString('hex');
        const buffer = await sharp(req.files[i].buffer)
          .resize({
            width: 520,
            height: 520,
            fit: 'contain',
          })
          .png()
          .toBuffer();
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: `reviews/${fileName}`,
          Body: buffer,
          ContentType: req.files[i].mimetype,
        });
        await s3Client.send(command);
        reviewImages.push(
          `${process.env.S3_BUCKET_ACCESS_URL}reviews/${fileName}`
        );
      }
      const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        {
          $push: {
            images: reviewImages,
          },
        },
        { new: true }
      );
      if (!updatedReview)
        return res
          .status(500)
          .send({ error: 'Something went wrong please try again.' });
      res.status(200).send({
        message: 'Your review has been updated.',
        review: updatedReview,
      });
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const likeOrDislikeReview = async (req, res) => {
  try {
    const { like, dislike, userId, reviewId } = req.body;
    let filter;
    if (like) {
      filter = {
        $push: {
          like: userId,
        },
        $pull: {
          dislike: userId,
        },
      };
    } else if (dislike) {
      filter = {
        $pull: {
          like: userId,
        },
        $push: {
          dislike: userId,
        },
      };
    } else {
      filter = {
        $pull: {
          like: userId,
          dislike: userId,
        },
      };
    }

    await Review.findByIdAndUpdate(reviewId, filter);
    let review = await Review.findOne({ _id: reviewId });

    if (!review)
      return res.status(500).send({
        error: 'Something went wrong please try again.',
      });

    res.status(200).send({
      message: 'Your action has been submited againts this review.',
      review,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const updateReview = async (req, res) => {
  try {
    await udpateReviewSchema.validate(req.body);
    const { reviewId, comment, rating, stationId, stationType, userId } =
      req.body;
    const review = await Review.findOne({
      _id: reviewId,
      stationType,
      stationId,
      'user.userId': userId,
    });
    if (!review)
      return res.status(404).send({
        error: 'No review found againts your record.',
      });
    const updated = await Review.findByIdAndUpdate(
      reviewId,
      {
        rating,
        comment,
      },
      { new: true }
    );
    if (!updated)
      return res.status(500).send({
        message: 'Something went wrong please try again.',
      });
    res
      .status(200)
      .send({ message: 'Your review has been updated.', review: updated });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const deleteReviewImages = async (req, res) => {
  try {
    const { reviewId, userId, imageId } = req.params;
    const review = await Review.findOne({
      _id: reviewId,
      'user.userId': userId,
    });
    if (!review)
      return res.status(404).send({
        error: 'No review found againts your record.',
      });
    const commandDel = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: imageId,
    });
    await s3Client.send(commandDel);

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        $pull: {
          images: `${process.env.S3_BUCKET_ACCESS_URL}reviews/${imageId}`,
        },
      },
      { new: true }
    );
    if (!updatedReview)
      return res.status(500).send({
        message: 'Something went wrong please try again.',
      });
    res.status(200).send({
      message: 'Your review image has been deleted.',
      review: updatedReview,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId, userId } = req.params;
    const review = await Review.findOne({
      _id: reviewId,
      'user.userId': userId,
    });
    if (!review)
      return res.status(404).send({
        error: 'No review found againts your record.',
      });
    await Reply.deleteMany({ reviewId });
    const deleted = await Review.deleteOne({
      _id: reviewId,
      'user.userId': userId,
    });
    if (deleted?.deletedCount !== 1)
      return res.status(500).send({
        error: 'Something went wrong please try again.',
      });
    if (review?.images?.length > 0)
      for (var i = 0; i < review?.images.length; i++) {
        const commandDel = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: `${
            review?.images[i]?.split(`${process.env.S3_BUCKET_ACCESS_URL}`)[1]
          }`,
        });
        await s3Client.send(commandDel);
      }
    res.status(200).send({
      message: 'Your review and all replies againts review has been deleted.',
    });
  } catch (error) {
    errorMessage(res, error);
  }
};
