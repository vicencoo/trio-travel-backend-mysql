/** @type {import('sequelize').ModelStatic<any>} */
const Insurance = require('../models/Insurance');
const { Op } = require('sequelize');

exports.createInsurance = async (req, res) => {
  try {
    const { client_name, contact_number, car_plate, expiration_date } =
      req.body;

    await Insurance.create({
      client_name,
      contact_number,
      car_plate,
      expiration_date,
    });

    res.json({ message: 'Insurance saved' });
  } catch (err) {
    console.error('Create insurance error', err);
    res.status(400).json({ message: 'Error while creating new insurance.' });
  }
};

exports.getInsurances = async (req, res) => {
  try {
    const { limit, page = 1 } = req.query;

    const itemsPerPage = Number(limit) || 1;
    const skip = (page - 1) * itemsPerPage;

    const { count, rows } = await Insurance.findAndCountAll({
      limit: itemsPerPage,
      offset: skip,
      order: [['createdAt', 'DESC']],
    });

    const totalPages = Math.ceil(count / itemsPerPage);

    res.json({ insurances: rows, totalPages, totalCount: count });
  } catch (err) {
    console.error('Get insurances error', err);
    res.status(400).json({ message: 'Error while getting all insurances' });
  }
};

exports.getExpiringInsurances = async (req, res) => {
  try {
    const { days = 7, limit, page = 1, searchQuery } = req.query;
    const itemsPerPage = Number(limit) || 10;
    const skip = (page - 1) * itemsPerPage;

    let whereCondition = {};

    if (days && days !== 'all') {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + Number(days));

      whereCondition.expiration_date = {
        [Op.between]: [today, endDate],
      };
    }

    if (searchQuery) {
      whereCondition = {
        [Op.or]: [
          { client_name: { [Op.like]: `%${searchQuery}%` } },
          { car_plate: { [Op.like]: `%${searchQuery}%` } },
        ],
      };
    }

    const { count, rows } = await Insurance.findAndCountAll({
      where: whereCondition,
      limit: itemsPerPage,
      offset: skip,
    });

    const totalPages = Math.ceil(count / itemsPerPage);

    res.json({ insurances: rows, totalPages, totalCount: count });
  } catch (err) {
    console.error('Expiring insurances error', err);
    res
      .status(400)
      .json({ message: 'Error while getting expiring insurances' });
  }
};

exports.renewInsurance = async (req, res) => {
  try {
    const { insuranceId } = req.query;
    const { expiration_date } = req.body;

    const insurance = await Insurance.findByPk(insuranceId);

    if (!insurance) {
      return res
        .status(404)
        .json({ message: 'Insurance not found!Try again.' });
    }

    await insurance.update({ expiration_date });

    res.json({ message: 'Insurance updated.' });
  } catch (err) {
    console.error('Renew insurance error', err);
    res.status(400).json({ message: 'Error while renewing insurance.' });
  }
};

exports.editInsurance = async (req, res) => {
  try {
    const { insuranceId } = req.query;
    const { client_name, contact_number, car_plate, expiration_date } =
      req.body;

    const insurance = await Insurance.findByPk(insuranceId);

    if (!insurance) {
      return res.status(404).json({ message: 'No insurance was found' });
    }

    await insurance.update({
      client_name,
      contact_number,
      car_plate,
      expiration_date,
    });

    res.json({ message: 'Insurance updated' });
  } catch (err) {
    console.error('Edit insurance error', err);
    res.status(400).json({ message: 'Error while editing insurance' });
  }
};

exports.deleteInsurance = async (req, res) => {
  try {
    const { insuranceId } = req.query;

    await Insurance.destroy({ where: { id: insuranceId } });

    res.json({ message: 'Insurance deleted successfully' });
  } catch (err) {
    console.error('Deleting insurance error', err);
    res.status(400).json({ message: 'Error while deleting insurance' });
  }
};
