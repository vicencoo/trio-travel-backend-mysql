const { Property, PropertyImage, Package, PackageImage } = require("../models");
const renderShareHtml = require("../utils/renderShareHtml");

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

    return res.send(
      renderShareHtml({
        title: property.title,
        description: `${property.city}, Shqipëri - ${property.price}€`,
        image: firstImage,
        url: frontendUrl,
      }),
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.sharePackage = async (req, res) => {
  try {
    const { slug } = req.params;
    const packageId = slug.split("-").pop();

    if (!slug || slug === "undefined" || !/^\d+$/.test(packageId)) {
      return res.status(400).send(`Invalid package slug: ${slug}`);
    }

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

    return res.send(
      renderShareHtml({
        title: touristPackage.title,
        description: touristPackage.destination || "Trio Travel Agency",
        image: firstImage,
        url: frontendUrl,
      }),
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
