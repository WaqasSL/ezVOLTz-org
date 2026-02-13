import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { errorMessage, s3Client } from '../../../config/config.js';
import Admin from '../../../models/AdminModel.js';

const bucketName = process.env.S3_BUCKET_NAME;

export const getAllLogos = async (req, res) => {
  try {
    const admin = await Admin.find({});
    res.status(200).send({ logos: admin?.[0].logos });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const changeLogo = async (req, res) => {
  const { index } = req.body;
  if (!req.file)
    return res.status(400).send({ error: 'Please upload a logo image.' });

  // Check the MIME type (allow any image MIME type)
  if (!req.file.mimetype.startsWith('image/'))
    return res
      .status(400)
      .send({ error: 'File type not supported. Please upload an image.' });

  if (req.file.size > 10485760)
    return res
      .status(400)
      .send({ error: 'File size too large. Maximum size should be 10MB.' });

  try {
    const admin = await Admin.findOne({});
    if (!admin) return res.status(404).send({ error: 'Admin not found.' });

    let logos = admin.logos || [];
    const buffer = await sharp(req.file.buffer).toBuffer();
    const fileName = `logoImage${index}`;
    const logoImage = `${process.env.S3_BUCKET_ACCESS_URL}logos/${fileName}.png`;

    const existingLogo = logos[index];

    if (existingLogo) {
      const oldLogoKey = existingLogo.split('logos/')[1];
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: `logos/${oldLogoKey}`,
      });
      await s3Client.send(deleteCommand);
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `logos/${fileName}.png`,
      Body: buffer,
      ContentType: req.file.mimetype,
    });
    await s3Client.send(command);

    logos[index] = logoImage;

    admin.logos = logos;
    await admin.save();

    res.status(200).send({ message: 'Logo updated successfully.' });
  } catch (error) {
    errorMessage(res, error);
  }
};
