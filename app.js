require("dotenv").config({ quiet: true });

const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const fs = require("fs");

/* IMPORT YOUR MODELS */
const Property = require("./models/Property");
const TouristPackage = require("./models/TouristPackage");
/* FRONTEND DIST PATH */
const frontendDistPath = path.join(__dirname, "public");

const startInsuranceReminder = require("./utils/insuranceReminder");

const propertyRoutes = require("./routes/propertyRoutes");
const planeTicketRoutes = require("./routes/planeTicketRoutes");
const packageRoutes = require("./routes/touristPackageRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const insuranceRoutes = require("./routes/insuranceRoutes");
const contactRoutes = require("./routes/contactRoutes");
const flightCompaniesRoutes = require("./routes/flightCompanyRoutes");
const shareRoutes = require("./routes/shareRoutes");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((origin) =>
  origin.trim(),
);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(propertyRoutes);
app.use(planeTicketRoutes);
app.use(packageRoutes);
app.use(destinationRoutes);
app.use(authRoutes);
app.use(bookingRoutes);
app.use(dashboardRoutes);
app.use(insuranceRoutes);
app.use(contactRoutes);
app.use(flightCompaniesRoutes);
app.use(shareRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

const port = process.env.PORT || 8000;

sequelize
  .sync()
  .then(() => {
    app.listen(port);
    console.log(`Connected on  port ${port}!`);

    startInsuranceReminder();
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = app;
