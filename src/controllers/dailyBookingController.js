const dailyBookingService = require('../services/dailyBookingService');

/**
 * DailyBooking Controller
 */

const dailyBookingController = {
  getAllDailyBookings: async (req, res, next) => {
    try {
      const bookings = await dailyBookingService.getAllDailyBookings();
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  },

  getDailyBookingById: async (req, res, next) => {
    try {
      const booking = await dailyBookingService.getDailyBookingById(req.bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Daily booking not found' });
      }
      res.json(booking);
    } catch (error) {
      next(error);
    }
  },

  createDailyBooking: async (req, res, next) => {
    try {
      const booking = await dailyBookingService.createDailyBooking(req.body);
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  },

  updateDailyBooking: async (req, res, next) => {
    try {
      const booking = await dailyBookingService.updateDailyBooking(req.bookingId, req.body);
      res.json(booking);
    } catch (error) {
      next(error);
    }
  },

  deleteDailyBooking: async (req, res, next) => {
    try {
      await dailyBookingService.deleteDailyBooking(req.bookingId);
      res.json({ message: 'Daily booking deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dailyBookingController;
