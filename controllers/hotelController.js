const { where } = require('sequelize');
const { Hotel, HotelFacility, HotelImage } = require('../models');
const clearImage = require('../utils/clearImage');

exports.addHotel = async (req, res) => {
  try {
    const { body } = req;
    const facilities = JSON.parse(body.facilities);
    const hotelImageFiles = req.files;

    const hotel = await Hotel.create({
      hotel_name: body.hotel_name,
      location: body.location,
      description: body.description,
      rating: Number(body.rating),
      reviews: Number(body.reviews),
      price: Number(body.price),
    });

    if (facilities.length) {
      const updatedFacilities = facilities.map((facility) => ({
        facility: facility,
        hotel_id: hotel.id,
      }));
      await HotelFacility.bulkCreate(updatedFacilities);
    }

    if (hotelImageFiles.length) {
      const images = hotelImageFiles.map((file) => ({
        hotel_image: `/images/hotel_images/${file.filename}`,
        hotel_id: hotel.id,
      }));
      await HotelImage.bulkCreate(images);
    }

    res.json({ message: 'Hotel saved successfully!' });
  } catch (err) {
    console.error('Add hotel error', err);
    res.status(400).json({ message: 'Error while adding new hotel' });
  }
};

exports.getHotels = async (req, res) => {
  try {
    const { limit, page = 1 } = req.query;
    const HOTEL_LIMIT = 20;
    const itemsPerPage = Math.min(Number(limit) || HOTEL_LIMIT, HOTEL_LIMIT);
    const skip = (page - 1) * itemsPerPage;

    const { rows: hotels, count: allHotels } = await Hotel.findAndCountAll({
      limit: itemsPerPage,
      offset: skip,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: HotelImage,
          as: 'hotel_images',
          attributes: ['id', 'hotel_image'],
        },
        {
          model: HotelFacility,
          as: 'facilities',
          attributes: ['facility'],
        },
      ],
      distinct: true,
    });
    const allPages = Math.ceil(allHotels / itemsPerPage);
    const pagination = { allHotels, allPages };

    res.json({ hotels, pagination });
  } catch (err) {
    console.error('Getting hotels error', err);
    res.status(400).json({ message: 'Error while getting all hotels' });
  }
};

exports.getOneHotel = async (req, res) => {
  try {
    const { hotelId } = req.query;

    const hotel = await Hotel.findByPk(hotelId, {
      include: [
        {
          model: HotelImage,
          as: 'hotel_images',
          attributes: ['id', 'hotel_image'],
        },
        {
          model: HotelFacility,
          as: 'facilities',
          attributes: ['id', 'facility'],
        },
      ],
    });

    res.json(hotel);
  } catch (err) {
    console.error('Getting hotel error', err);
    res.status(400).json({ message: 'Error while getting the hotel' });
  }
};

exports.editHotel = async (req, res) => {
  try {
    const { hotelId } = req.query;
    const { body } = req;
    const deletedImgs = body.deletedImages
      ? JSON.parse(body.deletedImages)
      : [];
    const newImagesFiles = req.files;
    const facilities = JSON.parse(body.facilities);

    const hotel = await Hotel.findByPk(hotelId);

    await hotel.update({
      hotel_name: body.hotel_name,
      location: body.location,
      description: body.description,
      rating: Number(body.rating),
      reviews: Number(body.reviews),
      price: Number(body.price),
    });

    await HotelFacility.destroy({ where: { hotel_id: hotel.id } });
    const updatedFacilities = facilities.map((facility) => ({
      facility: facility,
      hotel_id: hotel.id,
    }));
    await HotelFacility.bulkCreate(updatedFacilities);

    if (deletedImgs.length) {
      const images = await HotelImage.findAll({
        where: { hotel_image: deletedImgs, hotel_id: hotel.id },
      });

      images.forEach((img) => clearImage(img.hotel_image));

      await HotelImage.destroy({
        where: { hotel_image: deletedImgs, hotel_id: hotel.id },
      });
    }

    if (newImagesFiles.length) {
      const newImages = newImagesFiles.map((file) => ({
        hotel_image: `/images/hotel_images/${file.filename}`,
        hotel_id: hotel.id,
      }));
      await HotelImage.bulkCreate(newImages);
    }

    res.json('Hotel updated successfully!');
  } catch (err) {
    console.error('Edit hotel error', err);
    res.status(400).json({ message: 'Error while editing new hotel' });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const { hotelId } = req.query;

    const existingHotel = await Hotel.findByPk(hotelId, {
      include: [{ model: HotelImage, as: 'hotel_images' }],
    });

    existingHotel.hotel_images.map((img) => {
      clearImage(img.hotel_image);
    });

    await Hotel.destroy({ where: { id: hotelId } });

    res.json({ message: 'Hotel deleted!' });
  } catch (err) {
    console.error('Deleting hotel error', err);
    res.status(400).json({ message: 'Error while deleting hotel' });
  }
};
