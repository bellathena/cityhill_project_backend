const meterReadingService = require('../services/meterReadingService');

/**
 * MeterReading Controller
 */

const meterReadingController = {
  getAllMeterReadings: async (req, res, next) => {
    try {
      const readings = await meterReadingService.getAllMeterReadings();
      res.json(readings);
    } catch (error) {
      next(error);
    }
  },

  getMeterReadingById: async (req, res, next) => {
    try {
      const reading = await meterReadingService.getMeterReadingById(req.readingId);
      if (!reading) {
        return res.status(404).json({ error: 'Meter reading not found' });
      }
      res.json(reading);
    } catch (error) {
      next(error);
    }
  },

  createMeterReading: async (req, res, next) => {
    try {
      const reading = await meterReadingService.createMeterReading(req.body);
      res.status(201).json(reading);
    } catch (error) {
      next(error);
    }
  },

  updateMeterReading: async (req, res, next) => {
    try {
      const reading = await meterReadingService.updateMeterReading(req.readingId, req.body);
      res.json(reading);
    } catch (error) {
      next(error);
    }
  },

  deleteMeterReading: async (req, res, next) => {
    try {
      await meterReadingService.deleteMeterReading(req.readingId);
      res.json({ message: 'Meter reading deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = meterReadingController;
