import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorMessage } from '../../../config/config.js';
import Admin from '../../../models/AdminModel.js';

export const loginAdmin = async (req, res) => {
    try {
        const currentLoginDate = new Date();
        const user = await Admin.findOne({ email: req.body?.email });
        if (!user)
            return res
            .status(401)
            .send({ error: 'Email or Password are not valid.' });
        const password = await bcrypt.compare(
            req?.body?.password,
            user?.password
        );
        if (!password)
            return res
                .status(401)
                .send({ error: 'Email or Password are not valid.' });
        const sessionUser = { userId: user?._id, email: user?.email, role: 'admin' };
        req.session.userInfo = sessionUser;
        const accessToken = jwt.sign(
            { user: sessionUser },
            process.env.HASH_ACCESS_KEY,
            { expiresIn: '7d', algorithm: 'HS512' }
        );
        const refreshToken = jwt.sign(
            { user: sessionUser },
            process.env.HASH_SECRET_KEY,
            { expiresIn: '30d', algorithm: 'HS512' }
        );
        Admin.findByIdAndUpdate(user?._id, { lastLoginAt: currentLoginDate });
        res.status(200).send({
            user: { ...user?._doc, lastLoginAt: currentLoginDate },
            accessToken,
            refreshToken,
        });
    } catch (error) {
      errorMessage(res, error);
    }
};