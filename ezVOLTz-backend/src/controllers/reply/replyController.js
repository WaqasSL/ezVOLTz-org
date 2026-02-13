import { errorMessage } from '../../config/config.js';
import Reply from '../../models/ReplyModel.js';
import Review from '../../models/ReviewModel.js';
import User from '../../models/UserModel.js';
import {
  addReplySchema,
  updateReplySchema,
} from '../../schema/reply/replySchema.js';

export const getAllReplyByReview = async (req, res) => {
  const { reviewId } = req.params;
  const { page, limit } = req.query;
  try {
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    const count = await Reply.countDocuments({ reviewId });

    const totalPages = Math.ceil(count / pageSize);
    const skip = (pageNumber - 1) * pageSize;
    const replies = await Reply.find({ reviewId })
      .skip(skip)
      .limit(pageSize)
      .sort('-createdAt');

    res
      .status(200)
      .send({ replies, currentPage: pageNumber, totalPages: totalPages });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const addReply = async (req, res) => {
  try {
    await addReplySchema.validate(req.body);
    const { userId, reviewId, comment } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user)
      return res.status(404).send({
        error:
          'Your account not exist. If you want to give review then create your account first.',
      });
    const review = await Review.findOne({ _id: reviewId });
    if (!review)
      return res.status(404).send({
        error: 'No review found againts this record.',
      });
    const reply = await Reply.create({
      user: {
        name: user?.name,
        profileImage: user?.profileImage || null,
        userId: user?._id,
      },
      reviewId,
      comment,
    });
    if (!reply)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again.' });
    res.status(201).send({ message: 'Your reply has been submitted.' });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const likeOrDislikeReply = async (req, res) => {
  try {
    const { like, dislike, userId, reviewId, replyId } = req.body;
    const checkReply = await Reply.findOne({ _id: replyId, reviewId });
    if (!checkReply)
      return res.status(404).send({
        error: 'No reply found againts this record.',
      });
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

    await Reply.findByIdAndUpdate(replyId, filter, { new: true });
    let reply = await Reply.findOne({ _id: replyId, reviewId });

    if (!reply)
      return res.status(500).send({
        error: 'Something went wrong please try again.',
      });
    res.status(200).send({
      message: 'Your action has been submited againts this reply.',
      reply,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const updateReply = async (req, res) => {
  try {
    await updateReplySchema.validate(req.body);
    const { userId, replyId, reviewId, comment } = req.body;
    const reply = await Reply.findOne({
      _id: replyId,
      reviewId,
      'user.userId': userId,
    });
    if (!reply)
      return res
        .status(400)
        .send({ error: 'No reply found againt your record.' });
    const updated = await Reply.findByIdAndUpdate(
      replyId,
      { comment },
      { new: true }
    );
    if (!updated)
      return res
        .status(500)
        .send({ message: 'Something went wrong please try again.' });
    res
      .status(200)
      .send({ message: 'Your reply has been updated.', reply: updated });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const deleteReply = async (req, res) => {
  try {
    const { userId, replyId, reviewId } = req.params;
    const reply = await Reply.findOne({
      _id: replyId,
      reviewId,
      'user.userId': userId,
    });
    if (!reply)
      return res
        .status(400)
        .send({ error: 'No reply found againt your record.' });
    const deleted = await Reply.deleteOne({
      _id: replyId,
      reviewId,
      'user.userId': userId,
    });
    if (deleted?.deletedCount !== 1)
      return res.status(500).send({
        message: 'Something went wrong please try again.',
      });
    res.status(200).send({
      message: 'Your reply has been deleted.',
    });
  } catch (error) {
    errorMessage(res, error);
  }
};
