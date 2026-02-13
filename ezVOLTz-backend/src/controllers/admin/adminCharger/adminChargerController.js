import { errorMessage } from '../../../config/config.js';
import Charger from '../../../models/ChargerModel.js';
import 'dotenv/config.js';

export const getAllChargingActivitiesCount = async (req, res) => {
    const userId = req?.userInfo?.userId;
    if (!userId)
        return res
            .status(401)
            .send({ error: 'You are not authorized for this request.' });
    try {
        const chargingActivitiesCount = await Charger.estimatedDocumentCount();
        res.status(200).send({ chargingActivitiesCount });
    } catch (error) {
        errorMessage(res, error);
    }
};
