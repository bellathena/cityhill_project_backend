/**
 * Input validation middleware
 */

const validateRoom = (req, res, next) => {
  const { roomNumber, floor, typeId } = req.body;

  if (roomNumber === undefined || isNaN(parseInt(roomNumber))) {
    return res.status(400).json({ error: 'กรุณากรอกหมายเลขห้องและกรอกเป็นตัวเลข' });
  }

  if (floor === undefined || (typeof floor !== 'number' && typeof floor !== 'string')) {
    return res.status(400).json({ error: 'กรุณากรอกชั้นและกรอกเป็นตัวเลข' });
  }

  if (!typeId || isNaN(parseInt(typeId))) {
    return res.status(400).json({ error: 'กรุณาเลือกประเภทห้อง' });
  }

  next();
};

const validateRoomId = (req, res, next) => {
  const { id } = req.params;
  const roomId = parseInt(id, 10);

  if (isNaN(roomId)) {
    return res.status(400).json({ error: 'Invalid room number' });
  }

  req.roomId = roomId;
  next();
};

module.exports = {
  validateRoom,
  validateRoomId
};
