const express = require('express');
const roomController = require('../controllers/roomController');
const { validateRoom, validateRoomId } = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler');

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
router.put('/:id', validateRoomId, validateRoom, asyncHandler(roomController.updateRoom));

// DELETE /api/rooms/:id - Delete room
router.delete('/:id', validateRoomId, asyncHandler(roomController.deleteRoom));

module.exports = router;
