const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const authController = {
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' });
      }

      const user = await authService.login(username, password);

      // สร้าง JWT
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
