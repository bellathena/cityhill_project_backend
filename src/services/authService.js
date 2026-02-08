const bcrypt = require('bcryptjs');
const userService = require('../services/userService');

/**
 * Authentication Service
 */

const authService = {
  /**
   * Login - ตรวจสอบ username และ password
   */
  login: async (username, password) => {
    // Find user by username
    const user = await userService.getUserByUsername(username);

    if (!user) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      throw error;
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      throw error;
    }

    // Return user without password
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      phone: user.phone
    };
  },

  /**
   * Verify password
   */
  verifyPassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  }
};

module.exports = authService;
