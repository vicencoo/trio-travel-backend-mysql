const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: '10m' },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: '30d',
  });
};

const hashRefreshToken = (refreshToken) => {
  return crypto.createHash('sha256').update(refreshToken).digest('hex');
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
};
