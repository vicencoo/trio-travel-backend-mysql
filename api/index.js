const app = require('../app');
const sequelize = require('../config/database');
const mysql = require('mysql2');
console.log('mysql2 loaded:', !!mysql);

let initialized = false;

module.exports = async (req, res) => {
  try {
    if (!initialized) {
      await sequelize.authenticate();
      initialized = true;
    }

    return app(req, res);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
