require('dotenv').config({ quiet: true });

const express = require('express');
const sequelize = require('./utils/database');
const cors = require('cors');
const path = require('path');
const app = express();

const propertyRoutes = require('./routes/propertyRoutes');
const planeTicketRoutes = require('./routes/planeTicketRoutes');
const packageRoutes = require('./routes/touristPackageRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const destinationRoutes = require('./routes/destinationRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(propertyRoutes);
app.use(planeTicketRoutes);
app.use(packageRoutes);
app.use(hotelRoutes);
app.use(destinationRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

const port = process.env.PORT || 8000;

sequelize
  .sync()
  .then(() => {
    app.listen(port);
    console.log(`Connected on  port ${port}!`);
  })
  .catch((err) => {
    console.error(err);
  });
