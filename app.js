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

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: process.env.REQUEST_ORIGIN,
//     // origin: process.env.REQUEST_ORIGIN_NETWORK,
//     credentials: true,
//   }),
// );
// const allowedOrigins = [
//   process.env.REQUEST_ORIGIN,
//   process.env.REQUEST_ORIGIN_WWW,
//   process.env.REQUEST_ORIGIN_LOCAL,
// ].filter(Boolean);
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

app.use("/images", express.static(path.join(__dirname, "images")));

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* OG TAG INJECTOR */
function injectOgData(html, data) {
  return html
    .replace(/__OG_TITLE__/g, escapeHtml(data.title))
    .replace(/__OG_DESCRIPTION__/g, escapeHtml(data.description))
    .replace(/__OG_IMAGE__/g, escapeHtml(data.image))
    .replace(/__OG_URL__/g, escapeHtml(data.url));
}

/* PROPERTY SHARE */
app.get("/pronat/:slug", async (req, res) => {
  try {
    const property = await Property.findOne({
      where: { slug: req.params.slug },
    });

    const htmlPath = path.join(frontendDistPath, "index.html");

    let html = fs.readFileSync(htmlPath, "utf8");

    if (!property) {
      return res.sendFile(htmlPath);
    }

    const image =
      property.images?.[0]?.url ||
      property.images?.[0] ||
      property.property_images?.[0]?.url ||
      property.property_images?.[0] ||
      "https://www.triotravel.al/images/trio-travel-icon.webp";

    const title = property.title || property.name || "Trio Travel Agency";

    const description =
      property.description?.replace(/<[^>]*>/g, "")?.slice(0, 160) ||
      "Discover this property from Trio Travel Agency.";

    html = injectOgData(html, {
      title,
      description,
      image,
      url: `https://www.triotravel.al/pronat/${property.slug}`,
    });

    return res.send(html);
  } catch (err) {
    console.error(err);
    return res.sendFile(path.join(frontendDistPath, "index.html"));
  }
});

/* PACKAGE SHARE */
app.get("/paketat/:slug", async (req, res) => {
  try {
    const touristPackage = await TouristPackage.findOne({
      where: { slug: req.params.slug },
    });

    const htmlPath = path.join(frontendDistPath, "index.html");

    let html = fs.readFileSync(htmlPath, "utf8");

    if (!touristPackage) {
      return res.sendFile(htmlPath);
    }

    const image =
      touristPackage.images?.[0]?.url ||
      touristPackage.images?.[0] ||
      touristPackage.package_images?.[0]?.url ||
      touristPackage.package_images?.[0] ||
      "https://www.triotravel.al/images/trio-travel-icon.webp";

    const title =
      touristPackage.title || touristPackage.name || "Trio Travel Agency";

    const description =
      touristPackage.description?.replace(/<[^>]*>/g, "")?.slice(0, 160) ||
      "Discover this package from Trio Travel Agency.";

    html = injectOgData(html, {
      title,
      description,
      image,
      url: `https://www.triotravel.al/paketat/${touristPackage.slug}`,
    });

    return res.send(html);
  } catch (err) {
    console.error(err);
    return res.sendFile(path.join(frontendDistPath, "index.html"));
  }
});

app.use(express.static(frontendDistPath));

/* REACT FALLBACK */
app.use((req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});
// const port = process.env.PORT || 8000;

// sequelize
//   .sync()
//   .then(() => {
//     app.listen(port);
//     console.log(`Connected on  port ${port}!`);

//     startInsuranceReminder();
//   })
//   .catch((err) => {
//     console.error(err);
//   });

module.exports = app;
