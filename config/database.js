// const Sequelize = require('sequelize');

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,

//   {
//     dialect: 'mysql',
//     host: process.env.DB_HOST,
//   },
// );

// module.exports = sequelize;

require('dotenv').config({ quiet: true });

const { Sequelize } = require('sequelize');
const pg = require('pg');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectModule: pg,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 1,
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: 1000,
  },
});

module.exports = sequelize;
