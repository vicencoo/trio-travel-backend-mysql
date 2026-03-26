require('dotenv').config({ quiet: true });

const app = require('./app');
const sequelize = require('./config/database');
const startInsuranceReminder = require('./utils/insuranceReminder');

const port = process.env.PORT || 8000;

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Connected on port ${port}!`);
    });

    startInsuranceReminder();
  })
  .catch((err) => {
    console.error(err);
  });
