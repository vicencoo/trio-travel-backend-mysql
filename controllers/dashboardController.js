const {
  Property,
  Package,
  PlaneTicket,
  Destination,
} = require('../models/index');
/** @type {import('sequelize').ModelStatic<any>} */
const Booking = require('../models/Booking');
const getDateRanges = require('../utils/dateRanges');
const { fn, col, literal, Op } = require('sequelize');

exports.getDataCounts = async (req, res) => {
  try {
    const { currentMonthEnd, currentMonthStart, prevMonthEnd, prevMonthStart } =
      getDateRanges();

    const models = [Property, PlaneTicket, Package, Destination];
    const keys = ['pronat', 'biletat', 'paketat', 'destinacionet'];

    const currentCount = (Model) =>
      Model.count({
        where: {
          createdAt: { [Op.between]: [currentMonthStart, currentMonthEnd] },
        },
      });

    const prevCount = (Model) =>
      Model.count({
        where: { createdAt: { [Op.between]: [prevMonthStart, prevMonthEnd] } },
      });

    const [currentCounts, prevCounts, totalCounts] = await Promise.allSettled([
      Promise.all(models.map(currentCount)),
      Promise.all(models.map(prevCount)),
      Promise.all(models.map((m) => m.count())),
    ]);

    const current = currentCounts.value;
    const previous = prevCounts.value;
    const total = totalCounts.value;

    const data = keys.map((key, i) => {
      const curr = current[i];
      const prev = previous[i];

      const change =
        prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100);

      return { key, count: total[i], change, positive: change >= 0 };
    });

    res.json({ dataCounts: data });
  } catch (err) {
    console.error('Getting dashboard error', err);
    res.status(400).json({ message: 'Error while getting dashboard data' });
  }
};

// Note: This approach has error when using PostgreSQL

// exports.analytics = async (req, res) => {
//   try {
//     const now = new Date();
//     const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//     const monthEnd = new Date(
//       now.getFullYear(),
//       now.getMonth() + 1,
//       0,
//       23,
//       59,
//       59,
//     );

//     const [monthlyRevenue, dailyTickets, monthlyTickets, ticketStatus] =
//       await Promise.all([
//         // 1. Monthly Revenue
//         Booking.findAll({
//           attributes: [
//             [fn('DATE_FORMAT', col('created_at'), '%b'), 'month'],
//             [fn('MONTH', col('created_at')), 'month_num'],
//             [fn('ROUND', fn('SUM', col('ticket_price')), 2), 'revenue'],
//           ],
//           where: { created_at: { [Op.not]: null } },
//           group: [
//             fn('MONTH', col('created_at')),
//             fn('DATE_FORMAT', col('created_at'), '%b'),
//           ],
//           order: [[literal('month_num'), 'ASC']],
//           raw: true,
//         }),

//         // 2. Daily Tickets (current month only)
//         Booking.findAll({
//           attributes: [
//             [fn('DATE_FORMAT', col('created_at'), '%b %d'), 'day'],
//             [fn('COUNT', col('id')), 'tickets'],
//           ],
//           where: {
//             created_at: {
//               [Op.not]: null,
//               [Op.between]: [monthStart, monthEnd],
//             },
//           },
//           group: [
//             fn('DATE', col('created_at')),
//             fn('DATE_FORMAT', col('created_at'), '%b %d'),
//           ],
//           order: [[fn('DATE', col('created_at')), 'ASC']],
//           raw: true,
//         }),

//         // 3. Monthly Tickets
//         Booking.findAll({
//           attributes: [
//             [fn('DATE_FORMAT', col('created_at'), '%b'), 'month'],
//             [fn('MONTH', col('created_at')), 'month_num'],
//             [fn('COUNT', col('id')), 'tickets'],
//           ],
//           where: { created_at: { [Op.not]: null } },
//           group: [
//             fn('MONTH', col('created_at')),
//             fn('DATE_FORMAT', col('created_at'), '%b'),
//           ],
//           order: [[literal('month_num'), 'ASC']],
//           raw: true,
//         }),

//         // 4. Ticket Status breakdown
//         Booking.findAll({
//           attributes: [
//             ['status', 'name'],
//             [fn('COUNT', col('id')), 'value'],
//           ],
//           where: { status: { [Op.not]: null } },
//           group: ['status'],
//           raw: true,
//         }),
//       ]);

//     res.json({ monthlyRevenue, dailyTickets, monthlyTickets, ticketStatus });
//   } catch (error) {
//     console.error('Analytics error:', error);
//     res.status(500).json({ error: 'Failed to fetch analytics' });
//   }
// };

exports.analytics = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const dateColumn = 'ticket_date'; // or 'created_at' if that column really exists and is what you want

    const [monthlyRevenue, dailyTickets, monthlyTickets, ticketStatus] =
      await Promise.all([
        Booking.findAll({
          attributes: [
            [literal(`TO_CHAR("${dateColumn}", 'Mon')`), 'month'],
            [literal(`EXTRACT(MONTH FROM "${dateColumn}")`), 'month_num'],
            [fn('ROUND', fn('SUM', col('ticket_price')), 2), 'revenue'],
          ],
          where: {
            [dateColumn]: { [Op.not]: null },
          },
          group: [
            literal(`EXTRACT(MONTH FROM "${dateColumn}")`),
            literal(`TO_CHAR("${dateColumn}", 'Mon')`),
          ],
          order: [[literal('month_num'), 'ASC']],
          raw: true,
        }),

        Booking.findAll({
          attributes: [
            [literal(`TO_CHAR("${dateColumn}", 'Mon DD')`), 'day'],
            [fn('COUNT', col('id')), 'tickets'],
          ],
          where: {
            [dateColumn]: {
              [Op.not]: null,
              [Op.between]: [monthStart, monthEnd],
            },
          },
          group: [
            literal(`DATE("${dateColumn}")`),
            literal(`TO_CHAR("${dateColumn}", 'Mon DD')`),
          ],
          order: [[literal(`DATE("${dateColumn}")`), 'ASC']],
          raw: true,
        }),

        Booking.findAll({
          attributes: [
            [literal(`TO_CHAR("${dateColumn}", 'Mon')`), 'month'],
            [literal(`EXTRACT(MONTH FROM "${dateColumn}")`), 'month_num'],
            [fn('COUNT', col('id')), 'tickets'],
          ],
          where: {
            [dateColumn]: { [Op.not]: null },
          },
          group: [
            literal(`EXTRACT(MONTH FROM "${dateColumn}")`),
            literal(`TO_CHAR("${dateColumn}", 'Mon')`),
          ],
          order: [[literal('month_num'), 'ASC']],
          raw: true,
        }),

        Booking.findAll({
          attributes: [
            ['status', 'name'],
            [fn('COUNT', col('id')), 'value'],
          ],
          where: { status: { [Op.not]: null } },
          group: ['status'],
          raw: true,
        }),
      ]);

    res.json({ monthlyRevenue, dailyTickets, monthlyTickets, ticketStatus });
  } catch (error) {
    console.error('Analytics error message:', error.message);
    console.error('Analytics full error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
