import express from 'express';
import roomTypeController from '../controllers/roomTypeController.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

const validateRoomTypeId = (req, res, next) => {
  const { id } = req.params;
  const roomTypeId = parseInt(id, 10);
  if (isNaN(roomTypeId)) {
    return res.status(400).json({ error: 'Invalid room type ID' });
  }
  req.roomTypeId = roomTypeId;
  next();
};

/**
 * RoomType Routes /api/room-types
 */

router.get('/', asyncHandler(roomTypeController.getAllRoomTypes));
router.get('/:id', validateRoomTypeId, asyncHandler(roomTypeController.getRoomTypeById));
router.post('/', asyncHandler(roomTypeController.createRoomType));
router.put('/:id', validateRoomTypeId, asyncHandler(roomTypeController.updateRoomType));
router.delete('/:id', validateRoomTypeId, asyncHandler(roomTypeController.deleteRoomType));

export default router;
