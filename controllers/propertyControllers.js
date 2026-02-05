const { Property, PropertyImage } = require('../models');
const clearImage = require('../utils/clearImage');

exports.addProperty = async (req, res) => {
  try {
    const { body } = req;
    const propertyImageFiles = req.files || [];

    const property = await Property.create({
      title: body.title,
      listing_type: body.listing_type,
      property_type: body.property_type,
      description: body.description,
      city: body.city,
      street: body.street,
      area: body.area,
      price: Number(body.price),
      space: Number(body.space),
      bedrooms: body.bedrooms ? Number(body.bedrooms) : null,
      toilets: body.toilets ? Number(body.toilets) : null,
      floor_number: body.floor_number ? Number(body.floor_number) : null,
      build_year: body.build_year ? Number(body.build_year) : null,
    });

    if (propertyImageFiles.length > 0) {
      const property_images = propertyImageFiles.map((file) => ({
        property_image: `/images/property_images/${file.filename}`,
        property_id: property.id,
      }));

      await PropertyImage.bulkCreate(property_images);
    }

    res.status(201).json({ message: 'Property Created!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const { limit, page = 1 } = req.query;
    const DEFAULT_LIMIT = 20;

    const itemsPerPage = Math.min(
      Number(limit) || DEFAULT_LIMIT,
      DEFAULT_LIMIT,
    );
    const skip = (page - 1) * itemsPerPage;

    const { rows: properties, count: totalProducts } =
      await Property.findAndCountAll({
        limit: itemsPerPage,
        offset: skip,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: PropertyImage,
            as: 'property_images',
            attributes: ['id', 'property_image'],
          },
        ],
        distinct: true,
      });

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    res.json({
      properties,
      pagination: { totalPages, totalProducts },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOneProperty = async (req, res) => {
  try {
    const { id } = req.query;

    const property = await Property.findByPk(id, {
      include: [
        {
          model: PropertyImage,
          as: 'property_images',
          attributes: ['id', 'property_image'],
        },
      ],
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error while getting selected property' });
  }
};

exports.editProperty = async (req, res) => {
  try {
    const { id } = req.query;
    const { body } = req;
    const newImageFiles = req.files || [];

    const deletedImgs = body.deletedImages
      ? JSON.parse(body.deletedImages)
      : [];

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found!' });
    }

    await property.update({
      title: body.title,
      property_type: body.property_type,
      listing_type: body.listing_type,
      description: body.description,
      city: body.city,
      street: body.street,
      area: body.area,
      price: Number(body.price),
      space: Number(body.space),
      bedrooms: body.bedrooms ? Number(body.bedrooms) : null,
      toilets: body.toilets ? Number(body.toilets) : null,
      floor_number: body.floor_number ? Number(body.floor_number) : null,
      build_year: body.build_year ? Number(body.build_year) : null,
    });

    if (deletedImgs.length) {
      const images = await PropertyImage.findAll({
        where: { property_image: deletedImgs, property_id: property.id },
      });

      images.forEach((image) => {
        clearImage(image.property_image);
      });

      await PropertyImage.destroy({
        where: { property_image: deletedImgs, property_id: property.id },
      });
    }

    if (newImageFiles.length) {
      const newImages = newImageFiles.map((file) => ({
        property_image: `/images/property_images/${file.filename}`,
        property_id: property.id,
      }));

      await PropertyImage.bulkCreate(newImages);
    }

    res.json({ message: 'Property updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error while editing the property' });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.query;

    const existingProperty = await Property.findByPk(id, {
      include: [{ model: PropertyImage, as: 'property_images' }],
    });

    if (!existingProperty) {
      return res.status(404).json({ message: 'Property not found!' });
    }

    existingProperty.property_images.forEach((image) => {
      clearImage(image.property_image);
    });

    await PropertyImage.destroy({ where: { property_id: id } });

    await Property.destroy({ where: { id } });

    res.json({ message: 'Property deleted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error while deleting property' });
  }
};
