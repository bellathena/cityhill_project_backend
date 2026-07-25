import express from 'express';
import authController from '../controllers/authController.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

/**
 * Auth Routes /api/auth
 */

// POST /api/auth/login - Login user
router.post('/login', asyncHandler(authController.login));

export default router;
