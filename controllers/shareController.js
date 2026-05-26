const { Property, PropertyImage } = require("../models");

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
    });

    if (!property) return res.status(404).send("Property not found");

    const firstImage =
      property.property_images?.sort((a, b) => a.id - b.id)?.[0]
        ?.property_image ||
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
