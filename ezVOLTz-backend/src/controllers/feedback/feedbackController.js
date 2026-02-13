import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sgMail from '@sendgrid/mail';
import sharp from 'sharp';
import crypto from 'crypto';
import { errorMessage, s3Client } from '../../config/config.js';
import { submitFeedbackSchema } from '../../schema/feedback/feedbackSchema.js';
import Feedback from '../../models/FeedbackModel.js';
import { uploadFeedbackImages } from '../../routes/feedback.js';
import fs from 'fs';

const templateHTML = fs.readFileSync(
  './src/utls/sendGrid/feedbackTemplate.html',
  'utf8'
);

const bucketName = process.env.S3_BUCKET_NAME;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const getAllFeedBack = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).send({ feedbacks });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getSingleFeedbackByUser = async (req, res) => {
  const { feedbackId } = req.params;
  try {
    const feedback = await Feedback.findOne({ _id: feedbackId });
    res.status(200).send({ feedback });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const submitFeedback = async (req, res) => {
  uploadFeedbackImages(req, res, async function (err) {
    const user = req?.body?.user;
    if (err) return res.status(400).send({ error: err.message });
    try {
      let feedbackImages = [];
      await submitFeedbackSchema.validate(req.body);
      if (req?.files?.length > 0)
        for (var i = 0; i < req.files?.length; i++) {
          const fileName = crypto.randomBytes(32).toString('hex');
          const buffer = await sharp(req.files[i].buffer)
            .resize({
              width: 520,
              height: 520,
              fit: 'contain',
            })
            .toBuffer();
          const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: `feedbacks/${fileName}`,
            Body: buffer,
            ContentType: req.files[i].mimetype,
          });
          await s3Client.send(command);
          feedbackImages.push(
            `${process.env.S3_BUCKET_ACCESS_URL}feedbacks/${fileName}`
          );
        }
      const feedback = await Feedback.create({
        ...req.body,
        images: feedbackImages,
      });
      if (!feedback)
        return res
          .status(500)
          .send({ error: 'Something went wrong please try again.' });
      const msg = {
        name: 'EzVOLTz',
        from: { email: process.env.SENDGRID_ACCOUNT_EMAIL },
        subject: 'Feedback Submitted',
        html: templateHTML,
        personalizations: [
          {
            to: [{ email: user.email }],
            subject: 'Feedback Submitted',
          },
        ],
      };
      sgMail
        .send(msg)
        .then(() => {
          res.status(201).send({
            message: 'Thank you so much for sharing your experience with us.',
          });
        })
        .catch((error) => {
          res.status(401).send({ error: error });
        });
    } catch (error) {
      errorMessage(res, error);
    }
  });
};

export const deleteFeedback = async (req, res) => {
  const { feedbackId } = req.params;
  try {
    const feedback = await Feedback.findOne({ _id: feedbackId });
    if (!feedback) {
      return res.status(404).send({ error: 'Feedback not found.' });
    }
    const images = feedback.images;
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i].split(process.env.S3_BUCKET_ACCESS_URL)[1];
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: imageUrl,
      });
      await s3Client.send(command);
    }
    await Feedback.deleteOne({ _id: feedbackId });
    res.status(200).send({ message: 'Feedback deleted successfully.' });
  } catch (error) {
    errorMessage(res, error);
  }
};
