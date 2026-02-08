const express = require('express');
const roomTypeController = require('../controllers/roomTypeController');
const { validateRoomId } = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler');

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

module.exports = router;
