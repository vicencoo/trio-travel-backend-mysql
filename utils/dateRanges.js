const getDateRanges = () => {
  const now = new Date();
  return {
    // Current Month
    currentMonthStart: new Date(now.getFullYear(), now.getMonth(), 1),
    currentMonthEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    // Previous Month
    prevMonthStart: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    prevMonthEnd: new Date(now.getFullYear(), now.getMonth(), 0),
  };
};

module.exports = getDateRanges;
