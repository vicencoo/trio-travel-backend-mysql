const { Destination, DestinationImage, DestinationType } = require('../models');
const clearImage = require('../utils/clearImage');

exports.addDestination = async (req, res) => {
  try {
    const { body } = req;
    const destTypes = JSON.parse(body.destination_types);
    const destinationImagesFiles = req.files;

    const destination = await Destination.create({
      city: body.city,
      country: body.country,
      slogan: body.slogan,
    });

    if (destTypes.length) {
      const types = destTypes.map((type) => ({
        type: type.type,
        destination_id: destination.id,
      }));
      await DestinationType.bulkCreate(types);
    }

    if (destinationImagesFiles.length) {
      const images = destinationImagesFiles.map((file) => ({
        destination_image: `/images/destination_images/${file.filename}`,
        destination_id: destination.id,
      }));
      await DestinationImage.bulkCreate(images);
    }

    res.json({ message: 'Destination created!' });
  } catch (err) {
    console.error('Add destination error', err);
    res.status(400).json({ message: 'Error while adding a new destination' });
  }
};

exports.getDestinations = async (req, res) => {
  try {
    const { limit, page = 1 } = req.query;
    const DEST_LIMIT = 20;
    const itemsPerPage = Math.min(Number(limit) || DEST_LIMIT, DEST_LIMIT);
    const skip = (page - 1) * itemsPerPage;

    if (limit) {
      const { rows: destinations, count: allDestinations } =
        await Destination.findAndCountAll({
          limit: itemsPerPage,
          offset: skip,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: DestinationType,
              as: 'destination_types',
              attributes: ['id', 'type'],
            },
            {
              model: DestinationImage,
              as: 'destination_images',
              attributes: ['id', 'destination_image'],
            },
          ],
          distinct: true,
        });

      const allPages = Math.ceil(allDestinations / itemsPerPage);
      const pagination = { allDestinations, allPages };
      return res.json({ destinations, pagination });
    } else {
      const destinations = await Destination.findAll({
        limit: 15,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: DestinationImage,
            as: 'destination_images',
            attributes: ['id', 'destination_image'],
          },
        ],
        distinct: true,
      });

      return res.json(destinations);
    }
  } catch (err) {
    console.error('Getting destinations error', err);
    res.status(400).json({ message: 'Error while getting all destinations' });
  }
};

exports.editDestination = async (req, res) => {
  try {
    const { body } = req;
    const { destination_id } = req.query;
    const newImageFiles = req.files;
    const parsedTypes = JSON.parse(body.destination_types);
    const existingTypes = await DestinationType.findAll({
      where: { destination_id },
    });
    const incoming = parsedTypes.map((t) => t.type.toLowerCase().trim());
    const existing = existingTypes.map((t) => t.type.toLowerCase().trim());
    const newTypes = incoming.filter((type) => !existing.includes(type));
    const deletedTypes = existing.filter((type) => !incoming.includes(type));

    const destination = await Destination.findByPk(destination_id);

    await destination.update({
      city: body.city,
      country: body.country,
      slogan: body.slogan,
    });

    if (newTypes) {
      const types = newTypes.map((type) => ({
        type: type,
        destination_id: destination.id,
      }));
      await DestinationType.bulkCreate(types);
    }
    if (deletedTypes) {
      await Promise.all(
        deletedTypes.map((type) =>
          DestinationType.destroy({ where: { type } }),
        ),
      );
    }

    if (newImageFiles.length) {
      const img = await DestinationImage.findAll({
        where: { destination_id },
      });
      img.forEach((image) => clearImage(image.destination_image));
      await DestinationImage.destroy({ where: { destination_id } });

      const newImages = newImageFiles.map((file) => ({
        destination_image: `/images/destination_images/${file.filename}`,
        destination_id,
      }));
      await DestinationImage.bulkCreate(newImages);
    }

    res.json({ message: 'Destination updated!' });
  } catch (err) {
    console.error('Error editing destination', err);
    res.status(400).json({ message: 'Error while editing destination' });
  }
};

exports.deleteDestination = async (req, res) => {
  try {
    const { destination_id } = req.query;
    const images = await DestinationImage.findAll({
      where: { destination_id },
    });

    images.forEach((image) => clearImage(image.destination_image));

    await Destination.destroy({ where: { id: destination_id } });

    res.json({ message: 'Destination deleted !' });
  } catch (err) {
    console.error('Error deleting destination', err);
    res.status(400).json({ message: 'Error while deleting destination' });
  }
};
