const { Property, PropertyImage, Package, PackageImage } = require("../models");

exports.shareProperty = async (req, res) => {
  try {
    const { slug } = req.params;
    const propertyId = slug.split("-").pop();

    const property = await Property.findByPk(propertyId, {
      include: [
        {
          model: PropertyImage,
          as: "property_images",
          attributes: ["id", "property_image"],
        },
      ],
      order: [[{ model: PropertyImage, as: "property_images" }, "id", "ASC"]],
    });

    if (!property) return res.status(404).send("Property not found");

    const firstImage =
      property.property_images?.[0]?.property_image ||
      "https://www.triotravel.al/images/trio-travel-icon.webp";

    const frontendUrl = `https://www.triotravel.al/pronat/${slug}`;

    res.send(`
  <!doctype html>
  <html>
    <head>
      <title>${property.title}</title>

      <meta property="og:title" content="${property.title}" />
      <meta property="og:description" content="${property.city}, Shqipëri - ${property.price}€" />
      <meta property="og:image" content="${firstImage}" />
      <meta property="og:image:secure_url" content="${firstImage}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="${frontendUrl}" />

      <meta name="twitter:card" content="summary_large_image" />
    </head>

    <body>
      <script>
        window.location.href = "${frontendUrl}";
      </script>
    </body>
  </html>
`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.sharePackage = async (req, res) => {
  try {
    const { slug } = req.params;
    const packageId = slug.split("-").pop();

    const touristPackage = await Package.findByPk(packageId, {
      include: [
        {
          model: PackageImage,
          as: "package_images",
          attributes: ["id", "image"],
        },
      ],
      order: [[{ model: PackageImage, as: "package_images" }, "id", "ASC"]],
    });

    if (!touristPackage) {
      return res.status(404).send("Package not found");
    }

    const firstImage =
      touristPackage.package_images?.sort((a, b) => a.id - b.id)?.[0]?.image ||
      "https://www.triotravel.al/images/trio-travel-icon.webp";

    const frontendUrl = `https://www.triotravel.al/paketa-turistike/${slug}`;

    res.send(`
      <!doctype html>
      <html>
        <head>
          <title>${touristPackage.title}</title>
          <meta property="og:title" content="${touristPackage.title}" />
          <meta property="og:description" content="${touristPackage.destination || "Trio Travel Agency"}" />
          <meta property="og:image" content="${firstImage}" />
          <meta property="og:url" content="${frontendUrl}" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta http-equiv="refresh" content="0;url=${frontendUrl}" />
        </head>
        <body>Redirecting...</body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
