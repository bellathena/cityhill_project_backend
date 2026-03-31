const express = require('express');
const utilitiesController = require('../controllers/utilitiesController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const validateUtilityId = (req, res, next) => {
  const { id } = req.params;
  const utilityId = parseInt(id, 10);
  if (isNaN(utilityId)) {
    return res.status(400).json({ error: 'Invalid utility ID' });
  }
  req.utilityId = utilityId;
  next();
};

router.get('/', asyncHandler(utilitiesController.getAllUtilities));
router.get('/:id', validateUtilityId, asyncHandler(utilitiesController.getUtilityById));
router.post('/', asyncHandler(utilitiesController.createUtility));
router.put('/:id', validateUtilityId, asyncHandler(utilitiesController.updateUtility));
router.delete('/:id', validateUtilityId, asyncHandler(utilitiesController.deleteUtility));

module.exports = router;
