const { PlaneTicket, PlaneTicketImage } = require('../models');
const clearImage = require('../utils/clearImage');

exports.addPlaneTicket = async (req, res) => {
  try {
    const { body } = req;
    const ticketImageFiles = req.files;

    const planeTicket = await PlaneTicket.create({
      from: body.from,
      to: body.to,
      departure_airport: body.departure_airport,
      arrival_airport: body.arrival_airport,
      price: Number(body.price),
    });

    if (ticketImageFiles.length) {
      const ticket_images = ticketImageFiles.map((file) => ({
        image: `/images/ticket_images/${file.filename}`,
        ticket_id: planeTicket.id,
      }));

      await PlaneTicketImage.bulkCreate(ticket_images);
    }

    res.json({ message: 'Plane Ticket added!' });
  } catch (err) {
    console.error('Add plane ticket error', err);
    res.status(400).json({ message: 'Error while adding new plane ticket' });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const { limit, page = 1 } = req.query;
    const DEFAULT_LIMIT = 20;
    const data = {};

    const itemsPerPage = Math.min(
      Number(limit) || DEFAULT_LIMIT,
      DEFAULT_LIMIT,
    );
    const skip = (page - 1) * itemsPerPage;

    if (page) {
      data.tickets = await PlaneTicket.findAll({
        limit: itemsPerPage,
        offset: skip,
        include: [
          {
            model: PlaneTicketImage,
            as: 'ticket_images',
            attributes: ['id', 'image'],
          },
        ],
        distinct: true,
        order: [['createdAt', 'DESC']],
      });
    } else {
      data.tickets = await PlaneTicket.findAll({
        limit: itemsPerPage,
        include: [
          {
            model: PlaneTicketImage,
            as: 'ticket_images',
            attributes: ['id', 'image'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
    }

    const allTickets = await PlaneTicket.findAll();

    data.totalTickets = allTickets.length;
    data.totalPages = Math.ceil(data.totalTickets / itemsPerPage);

    const allPrices = allTickets.map((ticket) => ticket.price);
    const sum = allPrices.reduce((t, n) => t + Number(n), 0);
    data.averagePrice = Math.round(sum / data.totalTickets);
    data.minPrice = Math.min(...allPrices);

    res.json(data);
  } catch (err) {
    console.error('Error getting all tickets', err);
    res.status(400).json({ message: 'Error while getting all tickets' });
  }
};

exports.editTicket = async (req, res) => {
  try {
    const { body } = req;

    const { ticketId } = req.query;
    const ticketImageFiles = req.files;

    const planeTicket = await PlaneTicket.findByPk(ticketId);

    await planeTicket.update({
      from: body.from,
      to: body.to,
      departure_airport: body.departure_airport,
      arrival_airport: body.arrival_airport,
      price: Number(body.price),
    });

    if (ticketImageFiles.length) {
      const img = await PlaneTicketImage.findAll({
        where: { ticket_id: planeTicket.id },
      });
      img.forEach((image) => {
        clearImage(image.image);
      });

      await PlaneTicketImage.destroy({ where: { ticket_id: planeTicket.id } });

      const ticket_images = ticketImageFiles.map((file) => ({
        image: `/images/ticket_images/${file.filename}`,
        ticket_id: planeTicket.id,
      }));
      await PlaneTicketImage.bulkCreate(ticket_images);
    }

    res.json({ message: 'Plane ticket updated' });
  } catch (err) {
    console.error('Edit ticket error', err);
    res.status(400).json({ message: 'Error while editing the plane ticket' });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.query;

    const planeTicket = await PlaneTicket.findByPk(ticketId, {
      include: [{ model: PlaneTicketImage, as: 'ticket_images' }],
    });

    if (!planeTicket)
      return res.status(404).json({ message: 'No plane ticket was found' });

    planeTicket.ticket_images.forEach((img) => {
      clearImage(img.image);
    });

    await PlaneTicketImage.destroy({ where: { ticketId } });
    await PlaneTicket.destroy({ where: { id: ticketId } });

    res.json({ message: 'Plane ticket deleted' });
  } catch (err) {
    console.error('Ticket deletion error', err);
    res.status(400).json({ message: 'Error while deleting ticket' });
  }
};
