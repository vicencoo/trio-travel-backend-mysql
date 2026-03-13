const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next();
    // return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token!' });
  }
};

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    const role = req.user?.role || 'visitor';
    if (allowedRoles.includes(role)) {
      return next();
    }

    return res.status(403).json({ message: 'Access denied' });
  };
};

const protect = (allowedRoles = []) => {
  return [authenticate, authorize(allowedRoles)];
};

module.exports = { authenticate, protect };
