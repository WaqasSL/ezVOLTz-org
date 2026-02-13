import bcrypt from 'bcryptjs';
import 'dotenv/config';

export const authorizeSaasCharge = async (req, res, next) => {
  const token = req.headers['api-key'];
  if (!token) return res.status(401).send({ error: 'Invalid API key' });
  try {
    const isAuth = await bcrypt.compare(process.env.SAASCHARGE_AUTH_KEY, token);
    if (!isAuth) return res.status(401).send({ error: 'Invalid API key' });
    next();
  } catch (error) {
    res.status(403).send({ error: 'You are not authorized.' });
  }
};
