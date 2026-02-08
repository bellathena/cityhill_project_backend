const authService = require('../services/authService');

/**
 * Authentication Controller
 */

const authController = {
  /**
   * Login endpoint
   */
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' });
      }

      const user = await authService.login(username, password);
      
      // TODO: Add JWT token generation here
      res.json({
        message: 'Login successful',
        user
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
