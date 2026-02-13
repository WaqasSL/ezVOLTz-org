import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export const authorizationUser = async (req, res, next) => {
  const token = req.headers['authorization']?.split('Bearer ')[1];
  if (!token) return res.status(403).send({ error: 'You are not authorized.' });
  try {
    const { user } = jwt.verify(token, process.env.HASH_ACCESS_KEY);
    req.userInfo = user;
    await User.updateOne(
      { _id: req.userInfo?.userId },
      { lastActiveAt: new Date() }
    );
    next();
  } catch (error) {
    res.status(403).send({ error: 'You are not authorized.' });
  }
};
