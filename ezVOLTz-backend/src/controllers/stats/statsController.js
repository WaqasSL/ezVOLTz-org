import StatsModel from '../../models/StatsModel.js';

export const getStats = async (req, res) => {
  try {
    const stats = await StatsModel.find();
    res.status(200).send(stats);
  } catch (error) {
    errorMessage(res, error);
  }
};

export const createStat = async (req, res) => {
  try {
    const stats = await StatsModel.create(req.body);
    if (!stats) return res.status(400).send({ error: 'Stat not created.' });
    res.status(201).send(stats);
  } catch (error) {
    errorMessage(res, error);
  }
};

export const updateStat = async (req, res) => {
  try {
    const updatedStat = await StatsModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(201).send(updatedStat);
  } catch (error) {
    errorMessage(res, error);
  }
};
