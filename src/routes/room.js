import express from 'express';
import roomController from '../controllers/roomController.js';
import { validateRoom, validateRoomId } from '../middleware/validation.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

/**
 * Room Routes
 * All endpoints for CRUD operations on rooms
 */

// GET /api/rooms - Get all rooms
router.get('/', asyncHandler(roomController.getAllRooms));

// GET /api/rooms/:id - Get room by ID
router.get('/:id', validateRoomId, asyncHandler(roomController.getRoomById));

// POST /api/rooms - Create new room
router.post('/', validateRoom, asyncHandler(roomController.createRoom));

// PUT /api/rooms/:id - Update room
router.put('/:id', validateRoomId, asyncHandler(roomController.updateRoom));

// DELETE /api/rooms/:id - Delete room
router.delete('/:id', validateRoomId, asyncHandler(roomController.deleteRoom));

export default router;
