const express = require('express');
const dailyBookingController = require('../controllers/dailyBookingController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const validateBookingId = (req, res, next) => {
  const { id } = req.params;
  const bookingId = parseInt(id, 10);
  if (isNaN(bookingId)) {
    return res.status(400).json({ error: 'Invalid booking ID' });
  }
  req.bookingId = bookingId;
  next();
};

/**
 * DailyBooking Routes
 */

router.get('/', asyncHandler(dailyBookingController.getAllDailyBookings));
router.get('/:id', validateBookingId, asyncHandler(dailyBookingController.getDailyBookingById));
router.post('/', asyncHandler(dailyBookingController.createDailyBooking));
router.put('/:id', validateBookingId, asyncHandler(dailyBookingController.updateDailyBooking));
router.delete('/:id', validateBookingId, asyncHandler(dailyBookingController.deleteDailyBooking));

module.exports = router;
