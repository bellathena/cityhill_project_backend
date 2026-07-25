import express from 'express';
import monthlyContractController from '../controllers/monthlyContractController.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

const validateContractId = (req, res, next) => {
  const { id } = req.params;
  const contractId = parseInt(id, 10);
  if (isNaN(contractId)) {
    return res.status(400).json({ error: 'Invalid contract ID' });
  }
  req.contractId = contractId;
  next();
};

/**
 * MonthlyContract Routes
 */

router.get('/', asyncHandler(monthlyContractController.getAllMonthlyContracts));
router.get('/:id', validateContractId, asyncHandler(monthlyContractController.getMonthlyContractById));
router.post('/', asyncHandler(monthlyContractController.createMonthlyContract));
router.put('/:id', validateContractId, asyncHandler(monthlyContractController.updateMonthlyContract));
router.delete('/:id', validateContractId, asyncHandler(monthlyContractController.deleteMonthlyContract));

export default router;
