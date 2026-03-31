const express = require('express');
const utilityUsageController = require('../controllers/utilityUsageController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const validateUsageId = (req, res, next) => {
  const { id } = req.params;
  const usageId = parseInt(id, 10);
  if (isNaN(usageId)) {
    return res.status(400).json({ error: 'Invalid utility usage ID' });
  }
  req.usageId = usageId;
  next();
};

router.get('/', asyncHandler(utilityUsageController.getAllUsages));
router.get('/room/:roomId', asyncHandler(utilityUsageController.getUsagesByRoom));
router.get('/:id', validateUsageId, asyncHandler(utilityUsageController.getUsageById));
router.post('/', asyncHandler(utilityUsageController.createUsage));
router.put('/:id', validateUsageId, asyncHandler(utilityUsageController.updateUsage));
router.delete('/:id', validateUsageId, asyncHandler(utilityUsageController.deleteUsage));

module.exports = router;
