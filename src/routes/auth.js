const express = require('express');
const authController = require('../controllers/authController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

/**
 * Auth Routes /api/auth
 */

// POST /api/auth/login - Login user
router.post('/login', asyncHandler(authController.login));

module.exports = router;
