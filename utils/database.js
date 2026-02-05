const Sequelize = require('sequelize');

const sequelize = new Sequelize('travel-agency', 'root', 'vicenco1234', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
