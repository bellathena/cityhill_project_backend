const express = require('express');
const utilityRateController = require('../controllers/utilityRateController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const validateUtilityRateId = (req, res, next) => {
  const { id } = req.params;
  const utilityRateId = parseInt(id, 10);
  if (isNaN(utilityRateId)) {
    return res.status(400).json({ error: 'Invalid utility rate ID' });
  }
  req.utilityRateId = utilityRateId;
  next();
};

/**
 * UtilityRate Routes /api/utility-rates
 */

router.get('/', asyncHandler(utilityRateController.getAllUtilityRates));
router.get('/latest', asyncHandler(utilityRateController.getLatestUtilityRate));
router.get('/:id', validateUtilityRateId, asyncHandler(utilityRateController.getUtilityRateById));
router.post('/', asyncHandler(utilityRateController.createUtilityRate));
router.put('/:id', validateUtilityRateId, asyncHandler(utilityRateController.updateUtilityRate));
router.delete('/:id', validateUtilityRateId, asyncHandler(utilityRateController.deleteUtilityRate));

module.exports = router;
