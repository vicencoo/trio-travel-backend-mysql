const runInsuranceReminder = require('../../utils/insuranceReminder');

module.exports = async (req, res) => {
  try {
    await runInsuranceReminder();
    res.status(200).json({ message: 'Reminder executed successfully' });
  } catch (err) {
    console.error('CRON ERROR:', err.message);
    console.error(err.stack);
    res.status(500).json({ message: err.message });
  }
};
