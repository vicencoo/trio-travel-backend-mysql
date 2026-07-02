/** @type {import('sequelize').ModelStatic<any>} */
const Insurance = require("../models/Insurance");
const { Op } = require("sequelize");
const sendEmail = require("./sendEmail");

const runInsuranceReminder = async () => {
  const today = new Date();

  const reminderDate = new Date(today);
  reminderDate.setDate(today.getDate() + 7);

  const startOfDay = new Date(reminderDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(reminderDate);
  endOfDay.setHours(23, 59, 59, 999);

  const expiring = await Insurance.findAll({
    where: {
      expiration_date: {
        [Op.between]: [startOfDay, endOfDay],
      },
    },
  });

  if (expiring.length === 0) return;

  const rows = expiring
    .map((exp) => {
      const name = exp.client_name
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
      const plate = exp.car_plate.toUpperCase();

      return `<tr>
            <td>${name}</td>
            <td>${exp.expiration_date}</td>
            <td>${plate}</td>
          </tr>`;
    })
    .join("");

  const htmlMessage = `
      <h2>Përshëndetje Alesia,</h2>
      <p>Siguracionet e mëposhtme skadojnë pas 7 ditësh:</p>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>Emri i klientit</th>
            <th>Data e skadimit</th>
            <th>Targa e mjetit</th>

          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <p>Ju lutem merrni masat e nevojshme.</p>
    `;

  await sendEmail(
    "triotravel.imobiliare@gmail.com",
    `Rikujtim: ${expiring.length} siguracione që skadojnë pas 7 ditësh`,
    htmlMessage,
  );
};

module.exports = runInsuranceReminder;
