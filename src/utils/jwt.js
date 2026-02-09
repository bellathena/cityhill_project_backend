const jwt = require('jsonwebtoken');

/**
 * JWT Utilities
 */

const jwtUtils = {
  // Generate JWT token
  generateToken: (user, expiresIn = '1d') => {
    return jwt.sign(
      {
        userId: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );
  },

  // Verify JWT token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  },

  // Decode JWT token without verification
  decodeToken: (token) => {
    return jwt.decode(token);
  },

  // Generate refresh token (longer expiration)
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
};

module.exports = jwtUtils;
