import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import crypto from 'crypto';
import { errorMessage, s3Client } from '../../config/config.js';
import Vehicle from '../../models/VehicleModel.js';
import { vehicleSchema } from '../../schema/vehicle/vehicleSchema.js';
import Trip from '../../models/TripModel.js';

const bucketName = process.env.S3_BUCKET_NAME;

export const getAllVehicleByUser = async (req, res) => {
  const { userId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });

  try {
    let vehicles = await Vehicle.find({ userId }).populate({
      path: 'make',
      transform: (doc) => (doc === null ? null : doc),
    });
    vehicles = vehicles.map((vehicle) => {
      return {
        ...vehicle._doc,
        make: {
          _id: vehicle?.make?._id,
          name: vehicle?.make?.make,
        },
        model: vehicle?.make?.models?.filter(
          (model) => model?._id?.toString() == vehicle?.model?.toString()
        )[0],
      };
    });
    res.status(200).send(vehicles);
  } catch (error) {
    errorMessage(res, error);
  }
};

export const getSingleVehicleByUser = async (req, res) => {
  const { userId, vehicleId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });

  try {
    let vehicle = await Vehicle.findOne({ userId, _id: vehicleId }).populate({
      path: 'make',
      transform: (doc) => (doc === null ? null : doc),
    });
    if (!vehicle) return res.status(404).send({ error: 'Vehicle not found.' });
    vehicle = {
      ...vehicle?._doc,
      make: {
        _id: vehicle?.make?._id,
        name: vehicle?.make?.make,
      },
      model: vehicle?.make?.models?.filter(
        (model) => model?._id?.toString() == vehicle?.model?.toString()
      )[0],
    };
    res.status(200).send(vehicle);
  } catch (error) {
    errorMessage(res, error);
  }
};

export const addVehicle = async (req, res) => {
  const { userId } = req.body;
  if (userId !== req.userInfo?.userId)
    return res.status(401).send({ error: 'You are not authorized.' });

  //Check the file
  if (req.file) {
    // Check the MIME type (allow any image MIME type)
    if (!req.file.mimetype.startsWith('image/'))
      return res
        .status(400)
        .send({ error: 'File type not supported. Please upload an image.' });

    if (req.file.size > 10485760)
      return res
        .status(400)
        .send({ error: 'File size too large. Maximum size should be 10MB.' });
  }

  try {
    const vehicleExist = await Vehicle.findOne({
      make: req.body?.make,
      model: req.body?.model,
      userId: userId,
    });
    if (vehicleExist)
      return res
        .status(400)
        .send({ error: 'Vehicle already exist against this make and model.' });

    let fileName;
    await vehicleSchema.validate(req.body);
    if (req.file) {
      fileName = crypto.randomBytes(32).toString('hex');
      const buffer = await sharp(req.file.buffer)
        .resize({
          width: 800,
          height: 800,
          fit: 'contain',
        })
        .toBuffer();
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `vehicle/${fileName}`,
        Body: buffer,
        ContentType: req.file.mimetype,
      });

      await s3Client.send(command);
    }

    const savedVehicle = await Vehicle.create({
      ...req.body,
      picture: req.file
        ? `${process.env.S3_BUCKET_ACCESS_URL}vehicle/${fileName}`
        : null,
    });
    let vehicle = await Vehicle.findOne({ _id: savedVehicle?._id }).populate({
      path: 'make',
      transform: (doc) => (doc === null ? null : doc),
    });
    if (!vehicle) return res.status(404).send({ error: 'Vehicle not found.' });
    vehicle = {
      ...vehicle?._doc,
      make: {
        _id: vehicle?.make?._id,
        name: vehicle?.make?.make,
      },
      model: vehicle?.make?.models?.filter(
        (model) => model?._id?.toString() == vehicle?.model?.toString()
      )[0],
    };
    res.status(201).send({ message: 'Vehicle created successfully.', vehicle });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const updateVehicle = async (req, res) => {
  const { vehicleId, userId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res
      .status(401)
      .send({ error: 'You are not authorized for this request.' });
  try {
    const vehicleInTrip = await Trip.findOne({
      userId,
      vehicleId,
      status: 'inprogress',
    });
    if (vehicleInTrip)
      return res
        .status(400)
        .send({ error: 'Vehicle is being used in an on-going trip.' });

    const vehicleExist = await Vehicle.findOne({
      make: req.body.make,
      model: req.body.model,
      userId,
      _id: { $ne: vehicleId },
    });
    if (vehicleExist)
      return res
        .status(400)
        .send({ error: 'Vehicle already exist against this make and model.' });

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      userId: userId,
    }).exec();
    if (vehicle === null)
      return res.status(404).send({ error: 'Vehicle not found.' });
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
      const fileName = crypto.randomBytes(32).toString('hex');
      const commandDel = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: `${
          vehicle?.picture?.split(`${process.env.S3_BUCKET_ACCESS_URL}`)[1]
        }`,
      });
      s3Client.send(commandDel);
      const buffer = await sharp(req.file.buffer)
        .resize({
          width: 800,
          height: 800,
          fit: 'contain',
        })
        .toBuffer();
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `vehicle/${fileName}`,
        Body: buffer,
        ContentType: req.file.mimetype,
      });

      await s3Client.send(command);
      vehicle.picture = `${process.env.S3_BUCKET_ACCESS_URL}vehicle/${fileName}`;
    }
    const update = await Vehicle.findByIdAndUpdate(vehicleId, {
      ...req.body,
      picture: vehicle?.picture,
    });
    if (!update)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    let updateVehicle = await Vehicle.findOne({
      _id: vehicleId,
    }).populate({
      path: 'make',
      transform: (doc) => (doc === null ? null : doc),
    });
    if (!updateVehicle)
      return res.status(404).send({ error: 'Vehicle not found.' });
    updateVehicle = {
      ...updateVehicle?._doc,
      make: {
        _id: updateVehicle?.make?._id,
        name: updateVehicle?.make?.make,
      },
      model: updateVehicle?.make?.models?.filter(
        (model) => model?._id?.toString() == updateVehicle?.model?.toString()
      )[0],
    };
    res.status(200).send({
      message: 'Vehicle updated successfully.',
      vehicle: updateVehicle,
    });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const deleteVehicle = async (req, res) => {
  const { vehicleId, userId } = req.params;
  if (userId !== req.userInfo?.userId)
    return res
      .status(401)
      .send({ error: 'You are not authorized for this request.' });

  try {
    const vehicleInTrip = await Trip.findOne({
      userId,
      vehicleId,
      status: 'inprogress',
    });
    if (vehicleInTrip)
      return res
        .status(400)
        .send({ error: 'Vehicle is being used in an on-going trip.' });

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      userId: userId,
    });
    if (vehicle === null)
      return res.status(404).send({ error: 'Vehicle not found.' });
    const commandDel = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: `${
        vehicle?.picture?.split(`${process.env.S3_BUCKET_ACCESS_URL}`)[1]
      }`,
    });
    await s3Client.send(commandDel);
    const deleted = await Vehicle.deleteOne({
      _id: vehicleId,
      userId: userId,
    });
    if (deleted?.deletedCount !== 1)
      return res
        .status(500)
        .send({ error: 'Something went wrong please try again later.' });
    res.status(200).send({ message: 'Vehicle deleted successfully.' });
  } catch (error) {
    errorMessage(res, error);
  }
};
