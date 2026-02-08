const express = require('express');
const router = express.Router();
const roomAvailabilityController = require('../controllers/roomAvailabilityController');

/**
 * RoomAvailability Routes
 */

// GET all availability records
router.get('/', roomAvailabilityController.getAllAvailability);

// GET calendar view for all rooms in a month
router.get('/month/:year/:month', roomAvailabilityController.getMonthCalendar);

// GET room status summary for date range
router.get('/summary', roomAvailabilityController.getRoomStatusSummary);

// GET availability for specific date
router.get('/date/:date', roomAvailabilityController.getAvailabilityByDate);

// GET availability for room in month
router.get('/room/:roomId/month/:year/:month', roomAvailabilityController.getRoomMonthAvailability);

// GET availability for room in date range
router.get('/room/:roomId/date-range', roomAvailabilityController.getAvailabilityByRoomAndDateRange);

module.exports = router;
