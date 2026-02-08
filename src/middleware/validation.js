/**
 * Input validation middleware
 */

const validateRoom = (req, res, next) => {
  const { roomNumber, floor, typeId, allowedType, currentStatus } = req.body;

  if (!roomNumber || typeof roomNumber !== 'string') {
    return res.status(400).json({ error: 'roomNumber is required and must be a string' });
  }

  if (floor === undefined || (typeof floor !== 'number' && typeof floor !== 'string')) {
    return res.status(400).json({ error: 'floor is required and must be a number' });
  }

  if (!typeId || typeof typeId !== 'number') {
    return res.status(400).json({ error: 'typeId is required and must be a number' });
  }

  next();
};

const validateRoomId = (req, res, next) => {
  const { id } = req.params;
  const roomId = parseInt(id, 10);

  if (isNaN(roomId)) {
    return res.status(400).json({ error: 'Invalid room ID' });
  }

  req.roomId = roomId;
  next();
};

module.exports = {
  validateRoom,
  validateRoomId
};
