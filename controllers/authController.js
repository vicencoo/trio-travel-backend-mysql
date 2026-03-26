const { User, RefreshToken } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} = require('../utils/tokenManager');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'No user found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const hashedRefreshToken = hashRefreshToken(refreshToken);

    // Send refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    await RefreshToken.create({
      user_id: user.id,
      token: hashedRefreshToken,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.json({
      accessToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(400).json({ message: 'Login failed' });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error', err);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }
    const hashedRefreshToken = hashRefreshToken(refreshToken);
    const dbRefreshToken = await RefreshToken.findOne({
      where: { token: hashedRefreshToken },
    });
    if (!dbRefreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_KEY,
      async (err, decoded) => {
        if (err) {
          await RefreshToken.destroy({ where: { token: hashedRefreshToken } });
          return res
            .status(403)
            .json({ message: 'Refresh token expired. Please login again.' });
        }

        const user = await User.findByPk(decoded.userId);
        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken });
      },
    );
  } catch (err) {
    console.error('Refresh token error', err);
    res
      .status(400)
      .json({ message: 'Error while refreshing the access token' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) return res.json({ user: {} });
    const { user } = req;
    const currentUser = {
      id: user.id,
      role: user.role,
      email: user.email,
      username: user.username,
    };
    res.json({ user: currentUser });
  } catch (err) {
    console.error('Get user error', err);
    res.status(400).json({ message: 'Error while getting current user' });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(200).json({ message: 'Already logged out' });
    }

    const hashedToken = hashRefreshToken(refreshToken);

    await RefreshToken.destroy({ where: { token: hashedToken } });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    return res.json({ message: 'Logged out!' });
  } catch (err) {
    console.error('Logout error', err);
    return res.status(400).json({ message: 'Error while logging out!' });
  }
};
