import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import crypto from 'crypto';
import { errorMessage, s3Client } from '../../../config/config.js';
import Ads from '../../../models/AdsModel.js';
import { uploadAdsImages } from '../../../routes/admin/adminAds.js';
import { submitAdSchema } from '../../../schema/advertisment/adSchema.js';

const bucketName = process.env.S3_BUCKET_NAME;

const calculateAspectRatio = (width, height, precision = 1) => {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const gcdValue = gcd(width, height);
  const ratio = +(width / gcdValue / (height / gcdValue)).toFixed(precision);
  return ratio;
};

export const getAllAds = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page);
    const pageSize = parseInt(req?.query?.pageSize);
    const skipCount = (page - 1) * pageSize;
    const adsCount = await Ads.estimatedDocumentCount();
    const ads = await Ads.find({})
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(Number(pageSize));
    res.status(200).send({ ads, count: adsCount });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getAllActiveAds = async (req, res) => {
  try {
    const activeAds = await Ads.find({ active: true });

    // Check if there are active ads
    if (activeAds.length === 0) return res.status(200).send({ ads: [] });

    res.status(200).send({ ads: activeAds });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getAdById = async (req, res) => {
  const { adId } = req?.params;
  try {
    const ad = await Ads.findOne({ _id: adId }, '-__v');
    if (!ad) return res.status(401).send({ error: 'Ad does not exist.' });
    res.status(200).send({ ad: ad });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const toggleAdStatus = async (req, res) => {
  const { adId } = req?.params;
  try {
    const ad = await Ads.findOne({ _id: adId }, 'active');
    if (!ad) return res.status(401).send({ error: 'Ad does not exist.' });
    const updateAd = await Ads.findByIdAndUpdate(
      adId,
      {
        active: !ad?.active,
      },
      { new: true }
    );
    if (!updateAd)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    const msg = updateAd?.active ? 'Activated' : 'Deactivated';
    res.status(200).send({ message: `Campaign has been ${msg}` });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const publishAd = async (req, res) => {
  uploadAdsImages(req, res, async function (err) {
    if (err) return res.status(400).send({ error: err.message });
    try {
      await submitAdSchema.validate(req.body);
      const adImages = [];
      const commands = [];
      const logoImages = [];
      if (req?.files?.length > 0) {
        for (let i = 0; i < 3; i++) {
          const fileName = crypto.randomBytes(32).toString('hex');
          const buffer = await sharp(req.files[i].buffer).toBuffer();

          // Get image metadata
          const metadata = await sharp(buffer).metadata();
          const width = metadata.width;
          const height = metadata.height;

          // Calculate greatest common divisor (GCD) for width and height
          const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
          const gcdValue = gcd(width, height);

          // Calculate aspect ratio
          const aspectRatio = `${width / gcdValue}:${height / gcdValue}`;

          const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: `logos/${fileName}`,
            Body: buffer,
            ContentType: req.files[i].mimetype,
          });

          commands.push(command);
          logoImages.push({
            src: `${process.env.S3_BUCKET_ACCESS_URL}logos/${fileName}`,
            aspectRatio: aspectRatio,
          });
        }
        for (let i = 3; i < req.files?.length; i++) {
          const fileName = crypto.randomBytes(32).toString('hex');
          const buffer =
            req.files[i].mimetype === 'image/gif'
              ? req.files[i].buffer
              : await sharp(req.files[i].buffer).toBuffer();

          // Get image metadata
          const metadata = await sharp(buffer).metadata();
          const width = metadata.width;
          const height = metadata.height;

          // Calculate greatest common divisor (GCD) for width and height
          const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
          const gcdValue = gcd(width, height);

          // Calculate aspect ratio
          const aspectRatio = `${width / gcdValue}:${height / gcdValue}`;
          const croppedAspectRatio = calculateAspectRatio(width, height, 1);
          if (
            croppedAspectRatio === 1.8 ||
            croppedAspectRatio === 0.3 ||
            croppedAspectRatio >= 8 ||
            croppedAspectRatio <= 9
          ) {
            // Determine image type
            const imageType = width / height >= 1 ? 'landscape' : 'portrait';

            const command = new PutObjectCommand({
              Bucket: bucketName,
              Key: `ads/${fileName}`,
              Body: buffer,
              ContentType: req.files[i].mimetype,
            });
            commands.push(command);
            adImages.push({
              src: `${process.env.S3_BUCKET_ACCESS_URL}ads/${fileName}`,
              aspectRatio: aspectRatio,
              type: imageType,
            });
          } else
            return res.status(400).send({
              error: `${req.files[i].originalname} does not meet the dimensions criteria.`,
            });
        }
      }

      for (const command of commands) {
        await s3Client.send(command);
      }

      const ads = await Ads.create({
        title: req?.body?.title,
        company: req?.body?.company,
        heading: req?.body?.heading,
        link: req?.body?.link,
        logos: logoImages,
        images: adImages,
        startDateAndTime: req?.body?.startDateAndTime,
        endDateAndTime: req?.body?.endDateAndTime,
        active: true,
      });

      if (!ads)
        return res
          .status(500)
          .send({ error: 'Something went wrong please try again.' });

      res.status(201).send({
        message: 'Campaign has been submitted successfully.',
      });
    } catch (error) {
      errorMessage(res, error);
    }
  });
};

export const editAd = async (req, res) => {
  uploadAdsImages(req, res, async function (err) {
    const { adId } = req?.params;
    try {
      const ad = await Ads.findOne({ _id: adId }, '-__v');
      if (!ad) return res.status(401).send({ error: 'Ad does not exist.' });
      await submitAdSchema.validate(req.body);

      const adImages = ad?.images;
      let newAdImages = [];
      const logoImages = ad?.logos;
      let newLogoImages = [];

      const commands = [];
      let logoIndex = 0;
      let imageIndex = 0;
      const images =
        typeof req?.body?.images === String
          ? [req?.body?.images]
          : req?.body?.images;

      if (req?.files?.length > 0) {
        if (images) {
          for (const logo of logoImages) {
            let logoExists = false;
            let oldLogo = {};

            for (const image of images) {
              if (image === logo?.src) {
                oldLogo = {
                  src: logo.src,
                  aspectRatio: logo.aspectRatio,
                };
                logoExists = true;
              }
            }

            if (logoExists) {
              newLogoImages.push(oldLogo);
            } else {
              const commandDel = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: `${
                  logo?.src?.split(`${process.env.S3_BUCKET_ACCESS_URL}`)[1]
                }`,
              });
              await s3Client.send(commandDel);

              const fileName = crypto.randomBytes(32).toString('hex');
              const buffer = await sharp(
                req.files[logoIndex].buffer
              ).toBuffer();

              // Get image metadata
              const metadata = await sharp(buffer).metadata();
              const width = metadata.width;
              const height = metadata.height;

              // Calculate greatest common divisor (GCD) for width and height
              const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
              const gcdValue = gcd(width, height);

              // Calculate aspect ratio
              const aspectRatio = `${width / gcdValue}:${height / gcdValue}`;

              const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: `logos/${fileName}`,
                Body: buffer,
                ContentType: req.files[logoIndex].mimetype,
              });
              commands.push(command);

              newLogoImages.push({
                src: `${process.env.S3_BUCKET_ACCESS_URL}logos/${fileName}`,
                aspectRatio: aspectRatio,
              });
              logoIndex += 1;
            }
          }
        }

        for (const adImage of adImages) {
          let imageExists = false;
          let oldImage = {};

          if (images) {
            for (const image of images) {
              if (image === adImage?.src) {
                oldImage = {
                  src: adImage.src,
                  aspectRatio: adImage.aspectRatio,
                  type: adImage.type,
                };
                imageExists = true;
              }
            }
          }

          if (imageExists) {
            newAdImages.push(oldImage);
          } else {
            const index = imageIndex + logoIndex;
            const commandDel = new DeleteObjectCommand({
              Bucket: bucketName,
              Key: `${
                adImage?.src?.split(`${process.env.S3_BUCKET_ACCESS_URL}`)[1]
              }`,
            });
            await s3Client.send(commandDel);

            const fileName = crypto.randomBytes(32).toString('hex');
            const buffer =
              req.files[index].mimetype === 'image/gif'
                ? req.files[index].buffer
                : await sharp(req.files[index].buffer).toBuffer();

            // Get image metadata
            const metadata = await sharp(buffer).metadata();
            const width = metadata.width;
            const height = metadata.height;

            // Calculate greatest common divisor (GCD) for width and height
            const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
            const gcdValue = gcd(width, height);

            // Calculate aspect ratio
            const aspectRatio = `${width / gcdValue}:${height / gcdValue}`;
            const croppedAspectRatio = calculateAspectRatio(width, height, 1);

            if (
              croppedAspectRatio === 1.8 ||
              croppedAspectRatio === 0.3 ||
              croppedAspectRatio >= 8 ||
              croppedAspectRatio <= 9
            ) {
              // Determine image type
              const imageType = width / height >= 1 ? 'landscape' : 'portrait';

              const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: `ads/${fileName}`,
                Body: buffer,
                ContentType: req.files[index].mimetype,
              });
              commands.push(command);

              newAdImages.push({
                src: `${process.env.S3_BUCKET_ACCESS_URL}ads/${fileName}`,
                aspectRatio: aspectRatio,
                type: imageType,
              });
            } else {
              return res.status(400).send({
                error: `${req.files[index].originalname} does not meet the dimensions criteria.`,
              });
            }
            imageIndex += 1;
          }
        }
      } else {
        newAdImages = adImages;
        newLogoImages = logoImages;
      }

      if (commands.length > 0)
        for (const command of commands) await s3Client.send(command);

      const updatedAd = await Ads.findByIdAndUpdate(
        adId,
        {
          title: req?.body?.title,
          company: req?.body?.company,
          heading: req?.body?.heading,
          link: req?.body?.link,
          logos: newLogoImages,
          images: newAdImages,
          startDateAndTime: req?.body?.startDateAndTime,
          endDateAndTime: req?.body?.endDateAndTime,
        },
        { new: true }
      );

      if (!updatedAd)
        return res
          .status(500)
          .send({ error: 'Something went wrong please try again.' });

      res.status(200).send({
        message: 'Campaign has been updated successfully.',
      });
    } catch (error) {
      errorMessage(res, error);
    }
  });
};

export const deleteAd = async (req, res) => {
  const { adId } = req.params;
  try {
    const ad = await Ads.findOne({ _id: adId });
    if (!ad) return res.status(401).send({ error: 'Ad does not exist.' });
    for (const adImage of ad?.images) {
      const commandDel = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: `${adImage?.src?.split(`${process.env.S3_BUCKET_ACCESS_URL}`)[1]}`,
      });
      await s3Client.send(commandDel);
    }
    for (const logo of ad?.logos) {
      const commandDel = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: `${logo?.src?.split(`${process.env.S3_BUCKET_ACCESS_URL}`)[1]}`,
      });
      await s3Client.send(commandDel);
    }
    const deleted = await Ads.deleteOne({
      _id: adId,
    });
    if (deleted?.deletedCount !== 1)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res.status(200).send({ message: 'Campaign has been deleted.' });
  } catch (error) {
    errorMessage(res, error);
  }
};
