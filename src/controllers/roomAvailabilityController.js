const roomAvailabilityService = require("../services/roomAvailabilityService");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * RoomAvailability Controller
 */

const roomAvailabilityController = {
  // GET /api/room-availability - Get all availability records
  getAllAvailability: asyncHandler(async (req, res) => {
    const data = await roomAvailabilityService.getAllAvailability();
    res.json(data);
  }),

  // GET /api/room-availability/room/:roomId/date-range - Get availability for room in date range
  getAvailabilityByRoomAndDateRange: asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      const error = new Error(
        "startDate and endDate query parameters are required",
      );
      error.status = 400;
      throw error;
    }

    const data =
      await roomAvailabilityService.getAvailabilityByRoomAndDateRange(
        roomId,
        startDate,
        endDate,
      );

    res.json(data);
  }),

  // GET /api/room-availability/month/:year/:month - Get calendar view for month
  getMonthCalendar: asyncHandler(async (req, res) => {
    const { year, month } = req.params;

    if (!year || !month) {
      const error = new Error("year and month parameters are required");
      error.status = 400;
      throw error;
    }

    const data = await roomAvailabilityService.getMonthCalendar(
      parseInt(year),
      parseInt(month),
    );

    res.json(data);
  }),

  // GET /api/room-availability/room/:roomId/month/:year/:month - Get availability for room in month
  getRoomMonthAvailability: asyncHandler(async (req, res) => {
    const { roomId, year, month } = req.params;

    const data = await roomAvailabilityService.getRoomMonthAvailability(
      parseInt(roomId),
      parseInt(year),
      parseInt(month),
    );

    res.json(data);
  }),

  // GET /api/room-availability/date/:date - Get availability for specific date
  getAvailabilityByDate: asyncHandler(async (req, res) => {
    const { date } = req.params;

    const data = await roomAvailabilityService.getAvailabilityByDate(date);

    res.json(data);
  }),

  // GET /api/room-availability/summary - Get room status summary
  getRoomStatusSummary: asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      const error = new Error(
        "startDate and endDate query parameters are required",
      );
      error.status = 400;
      throw error;
    }

    const data = await roomAvailabilityService.getRoomStatusSummary(
      startDate,
      endDate,
    );
    res.json(data);
  }),
};

module.exports = roomAvailabilityController;
