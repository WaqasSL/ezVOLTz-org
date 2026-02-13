import jwt from 'jsonwebtoken';

export const authorizationAdmin = async (req, res, next) => {
  const token = req.headers['authorization']?.split('Bearer ')[1];
  if (!token)
    return res.status(403).send({ error: 'Invalid token or expired.' });
  try {
    const { user } = jwt.verify(token, process.env.HASH_ACCESS_KEY);
    if (user.role !== 'admin')
      return res.status(403).send({ error: 'Only admins are authorized.' });
    req.userInfo = user;
    next();
  } catch (error) {
    res.status(403).send({ error: 'You are not authorized.' });
  }
};
