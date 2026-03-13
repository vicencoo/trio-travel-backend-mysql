/** @type {import('sequelize').ModelStatic<any>} */
const Booking = require('../models/Booking');
const { Op } = require('sequelize');

exports.addBooking = async (req, res) => {
  try {
    const { client_name, ticket_date, ticket_code, ticket_price } = req.body;

    await Booking.create({
      client_name,
      ticket_date,
      ticket_code,
      ticket_price: Number(ticket_price),
    });

    res.json({ message: 'Booking saved!' });
  } catch (err) {
    console.error('Add booking error', err);
    res.status(400).json({ message: 'Error while adding new booking' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']] });

    res.json(bookings);
  } catch (err) {
    console.error('Get bookings error', err);
    res.status(400).json({ message: 'Error while getting all bookings' });
  }
};

exports.getCheckinTickets = async (req, res) => {
  try {
    const { date } = req.query;
    let stats = {};

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const startOfNextDay = new Date(nextDay);
    startOfNextDay.setHours(0, 0, 0, 0);

    const endOfNextDay = new Date(nextDay);
    endOfNextDay.setHours(24, 59, 59, 999);

    const { rows: checkInTickets, count: totalTickets } =
      await Booking.findAndCountAll({
        where: {
          ticket_date: { [Op.between]: [startOfNextDay, endOfNextDay] },
        },
        order: [['createdAt', 'DESC']],
      });

    stats.completedTickets = checkInTickets.filter(
      (item) => item.status === 'completed',
    ).length;
    stats.pendingTickets = checkInTickets.filter(
      (item) => item.status === 'pending',
    ).length;

    stats.progress =
      totalTickets > 0
        ? Math.round((stats.completedTickets / totalTickets) * 100)
        : 0;

    stats.totalTickets = totalTickets;

    res.json({ tickets: checkInTickets, stats });
  } catch (err) {
    console.error('Get checkin tickets error', err);
    res.status(400).json({ message: 'Error while getting checkin tickets' });
  }
};

exports.bookingToggleStatus = async (req, res) => {
  try {
    const { bookingId } = req.query;

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found!' });
    }

    booking.status = booking.status === 'pending' ? 'completed' : 'pending';

    await booking.save();

    res.json({ message: 'Status updated' });
  } catch (err) {
    console.error('Toggle status error', err);
    res.status(400).json({ message: 'Error while toggling status' });
  }
};

exports.editBooking = async (req, res) => {
  try {
    const { bookingId } = req.query;
    const { client_name, ticket_date, ticket_code, ticket_price } = req.body;

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'No booking found' });
    }

    await booking.update({
      client_name,
      ticket_date,
      ticket_code,
      ticket_price: Number(ticket_price),
    });

    res.json({ message: 'Booking Updated' });
  } catch (err) {
    console.error('Edit booking error', err);
    res.status(400).json({ message: 'Error while edit booking!' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.query;

    await Booking.destroy({ where: { id: bookingId } });

    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Delete booking error', err);
    res.status(400).json({ message: 'Error while deleting booking' });
  }
};
