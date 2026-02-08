const roomCheckService = require('../services/roomCheckService');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * RoomCheck Controller - Handle check-in/check-out records
 */

const roomCheckController = {
  // GET /api/room-checks - Get all room checks
  getAllRoomChecks: asyncHandler(async (req, res) => {
    const data = await roomCheckService.getAllRoomChecks();
    res.json(
      data
    );
  }),

  // GET /api/room-checks/:id - Get room check by ID
  getRoomCheckById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await roomCheckService.getRoomCheckById(parseInt(id));

    if (!data) {
      const error = new Error('Room check not found');
      error.status = 404;
      throw error;
    }

    res.json(
      data
    );
  }),

  // GET /api/room-checks/booking/:bookingId - Get checks by daily booking
  getRoomChecksByBooking: asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const data = await roomCheckService.getRoomChecksByReference(parseInt(bookingId), null);

    res.json(
      data
    );
  }),

  // GET /api/room-checks/contract/:contractId - Get checks by monthly contract
  getRoomChecksByContract: asyncHandler(async (req, res) => {
    const { contractId } = req.params;

    const data = await roomCheckService.getRoomChecksByReference(null, parseInt(contractId));

    res.json(
      data
    );
  }),

  // POST /api/room-checks - Create room check
  createRoomCheck: asyncHandler(async (req, res) => {
    const { dailyBookingId, monthlyContractId, checkType, conditionBed, conditionAir, conditionBathroom, conditionLights, notes, evidencePhotos } = req.body;

    // Validate required fields
    if (!checkType) {
      const error = new Error('checkType is required');
      error.status = 400;
      throw error;
    }

    if (!['CHECK_IN', 'CHECK_OUT'].includes(checkType)) {
      const error = new Error('checkType must be "CHECK_IN" or "CHECK_OUT"');
      error.status = 400;
      throw error;
    }

    const data = await roomCheckService.createRoomCheck({
      dailyBookingId,
      monthlyContractId,
      checkType,
      conditionBed,
      conditionAir,
      conditionBathroom,
      conditionLights,
      notes,
      evidencePhotos
    });

    res.status(201).json(
      data
    );
  }),

  // PUT /api/room-checks/:id - Update room check
  updateRoomCheck: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await roomCheckService.updateRoomCheck(parseInt(id), req.body);

    res.json({
      success: true,
      data
    });
  }),

  // DELETE /api/room-checks/:id - Delete room check
  deleteRoomCheck: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await roomCheckService.deleteRoomCheck(parseInt(id));

    res.json({
      success: true,
      message: 'Room check deleted successfully'
    });
  })
};

module.exports = roomCheckController;
