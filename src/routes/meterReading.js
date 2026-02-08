const express = require('express');
const meterReadingController = require('../controllers/meterReadingController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const validateReadingId = (req, res, next) => {
  const { id } = req.params;
  const readingId = parseInt(id, 10);
  if (isNaN(readingId)) {
    return res.status(400).json({ error: 'Invalid meter reading ID' });
  }
  req.readingId = readingId;
  next();
};

/**
 * MeterReading Routes
 */

router.get('/', asyncHandler(meterReadingController.getAllMeterReadings));
router.get('/:id', validateReadingId, asyncHandler(meterReadingController.getMeterReadingById));
router.get('/room/:roomId/:month/:year', asyncHandler(meterReadingController.getMeterReadingsByMonthYear));
router.post('/', asyncHandler(meterReadingController.createMeterReading));
router.put('/room/:roomId/:month/:year', asyncHandler(meterReadingController.updateMeterReading));
router.delete('/:id', validateReadingId, asyncHandler(meterReadingController.deleteMeterReading));

module.exports = router;
