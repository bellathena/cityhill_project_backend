const express = require('express');
const userController = require('../controllers/userController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const validateUserId = (req, res, next) => {
  const { id } = req.params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  req.userId = userId;
  next();
};

const validateUserData = (req, res, next) => {
  const { username, password, fullName } = req.body;

  // For create (POST)
  if (req.method === 'POST') {
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({ error: 'username is required and must be a non-empty string' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'password is required and must be at least 6 characters' });
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      return res.status(400).json({ error: 'fullName is required and must be a non-empty string' });
    }
  }

  next();
};

/**
 * User Routes /api/users
 */

router.get('/', asyncHandler(userController.getAllUsers));
router.get('/:id', validateUserId, asyncHandler(userController.getUserById));
router.post('/', validateUserData, asyncHandler(userController.createUser));
router.put('/:id', validateUserId, asyncHandler(userController.updateUser));
router.delete('/:id', validateUserId, asyncHandler(userController.deleteUser));

module.exports = router;
