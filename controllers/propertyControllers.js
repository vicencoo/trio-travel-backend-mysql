const { Op } = require('sequelize');
const { Property, PropertyImage } = require('../models');
// const clearImage = require('../utils/clearImage');
const cloudinary = require('cloudinary');

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
      status: body.status,
      availability: body.availability,
      publishedAt: body.status === 'active' ? new Date() : null,
    });

    if (propertyImageFiles.length > 0) {
      const property_images = propertyImageFiles.map((file) => ({
        // property_image: `/images/property_images/${file.filename}`,
        property_image: file.cloudinaryUrl, // ✅ Cloudinary URL
        public_id: file.cloudinaryPublicId,
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
    const {
      limit,
      page = 1,
      searchQuery,
      listingType,
      status = 'active',
    } = req.query;
    const DEFAULT_LIMIT = 20;

    let whereCondition = {};
    if (searchQuery) {
      whereCondition = {
        [Op.or]: [
          { title: { [Op.like]: `%${searchQuery}%` } },
          { description: { [Op.like]: `%${searchQuery}%` } },
          { city: { [Op.like]: `%${searchQuery}%` } },
          { street: { [Op.like]: `%${searchQuery}%` } },
          { area: { [Op.like]: `%${searchQuery}%` } },
        ],
      };
    }

    if (listingType && listingType !== 'all') {
      whereCondition = {
        ...whereCondition,
        listing_type: listingType,
      };
    }

    if (status && status !== 'all') {
      whereCondition = {
        ...whereCondition,
        status: status,
      };
    }

    const itemsPerPage = Math.min(
      Number(limit) || DEFAULT_LIMIT,
      DEFAULT_LIMIT,
    );
    const skip = (page - 1) * itemsPerPage;

    const { rows: properties, count: totalProducts } =
      await Property.findAndCountAll({
        where: whereCondition,
        limit: itemsPerPage,
        offset: skip,
        order: [['publishedAt', 'DESC']],
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

exports.getProperty = async (req, res) => {
  try {
    console.log('REQUEST IS HERE');

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

exports.renewProperty = async (req, res) => {
  try {
    const { id } = req.query;

    const property = await Property.findByPk(id);

    if (!property)
      return res.status(404).json({ message: 'Property not found!' });

    if (property.status === 'draft') return;

    await property.update({ publishedAt: new Date() });

    res.json({ message: 'Property Renewed.' });
  } catch (err) {
    console.error('Renew property error', err);
    res.status(400).json({ message: 'Error while renewing a property' });
  }
};

exports.publishOrDraft = async (req, res) => {
  try {
    const { id } = req.query;

    const property = await Property.findByPk(id);

    if (!property) res.status(404).json({ message: 'Property not found!' });

    let newStatus = '';
    if (property.status === 'active') {
      newStatus = 'draft';
      property.publishedAt = null;
    } else if (property.status === 'draft') {
      newStatus = 'active';
      property.publishedAt = new Date();
    } else {
      return res.status(400).json({ message: 'Invalid property status' });
    }

    property.status = newStatus;
    await property.save();

    res
      .status(200)
      .json({ message: `Property status updated to ${newStatus}` });
  } catch (err) {
    console.error('Publish Draft error', err);
    res.status(400).json({
      message: 'Something went wrong while drafting or publishing a property',
    });
  }
};

// exports.editProperty = async (req, res) => {
//   try {
//     const { id } = req.query;
//     const { body } = req;
//     const newImageFiles = req.files || [];

//     const deletedImgs = body.deletedImages
//       ? JSON.parse(body.deletedImages)
//       : [];

//     const property = await Property.findByPk(id);

//     if (!property) {
//       return res.status(404).json({ message: 'Property not found!' });
//     }

//     await property.update({
//       title: body.title,
//       property_type: body.property_type,
//       listing_type: body.listing_type,
//       description: body.description,
//       city: body.city,
//       street: body.street,
//       area: body.area,
//       price: Number(body.price),
//       space: Number(body.space),
//       bedrooms: body.bedrooms ? Number(body.bedrooms) : null,
//       toilets: body.toilets ? Number(body.toilets) : null,
//       floor_number: body.floor_number ? Number(body.floor_number) : null,
//       build_year: body.build_year ? Number(body.build_year) : null,
//       status: body.status,
//       availability: body.availability,
//       publishedAt: body.status === 'draft' ? null : property.publishedAt,
//     });

//     if (deletedImgs.length) {
//       const images = await PropertyImage.findAll({
//         where: { property_image: deletedImgs, property_id: property.id },
//       });

//       images.forEach((image) => {
//         clearImage(image.property_image);
//       });

//       await PropertyImage.destroy({
//         where: { property_image: deletedImgs, property_id: property.id },
//       });
//     }

//     if (newImageFiles.length) {
//       const newImages = newImageFiles.map((file) => ({
//         property_image: `/images/property_images/${file.filename}`,
//         property_id: property.id,
//       }));

//       await PropertyImage.bulkCreate(newImages);
//     }

//     res.json({ message: 'Property updated successfully!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error while editing the property' });
//   }
// };

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
      status: body.status,
      availability: body.availability,
      publishedAt:
        body.status === 'active' && !property.publishedAt
          ? new Date()
          : body.status === 'draft'
            ? null
            : property.publishedAt,
    });

    // if (deletedImgs.length) {
    //   const imagesToDelete = await PropertyImage.findAll({
    //     where: {
    //       property_id: property.id,
    //       property_image: {
    //         [Op.in]: deletedImgs,
    //       },
    //     },
    //   });

    //   await Promise.all(
    //     imagesToDelete.map(async (image) => {
    //       if (image.public_id) {
    //         await cloudinary.uploader.destroy(image.public_id);
    //       }
    //     }),
    //   );

    //   await PropertyImage.destroy({
    //     where: {
    //       property_id: property.id,
    //       property_image: {
    //         [Op.in]: deletedImgs,
    //       },
    //     },
    //   });
    // }

    if (deletedImgs.length) {
      const imagesToDelete = await PropertyImage.findAll({
        where: {
          property_id: property.id,
          public_id: {
            [Op.in]: deletedImgs,
          },
        },
      });

      console.log(
        'imagesToDelete:',
        imagesToDelete.map((img) => ({
          id: img.id,
          property_image: img.property_image,
          public_id: img.public_id,
        })),
      );

      await Promise.all(
        imagesToDelete.map(async (image) => {
          if (image.public_id) {
            const result = await cloudinary.uploader.destroy(image.public_id);
            console.log('Cloudinary delete result:', image.public_id, result);
          }
        }),
      );

      await PropertyImage.destroy({
        where: {
          property_id: property.id,
          public_id: {
            [Op.in]: deletedImgs,
          },
        },
      });
    }

    if (newImageFiles.length) {
      const newImages = newImageFiles.map((file) => ({
        property_image: file.cloudinaryUrl,
        public_id: file.cloudinaryPublicId,
        property_id: property.id,
      }));

      await PropertyImage.bulkCreate(newImages);
    }

    return res.json({ message: 'Property updated successfully!' });
  } catch (err) {
    console.error('EDIT PROPERTY ERROR:', err.message);
    console.error(err.stack);
    return res.status(500).json({
      message: err.message || 'Error while editing the property',
    });
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

    await Promise.all(
      existingProperty.property_images.map(async (image) => {
        if (image.public_id) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }),
    );

    await PropertyImage.destroy({ where: { property_id: id } });

    await Property.destroy({ where: { id } });

    res.json({ message: 'Property deleted!' });
  } catch (err) {
    console.error('DELETE PROPERTY ERROR:', err.message);
    console.error(err.stack);
    res.status(500).json({ message: 'Error while deleting property' });
  }
};
