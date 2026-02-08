const express = require('express');
const router = express.Router();
const moveOutSettlementController = require('../controllers/moveOutSettlementController');

/**
 * MoveOutSettlement Routes
 */

// GET all settlements
router.get('/', moveOutSettlementController.getAllSettlements);

// GET settlement by contract ID
router.get('/contract/:contractId', moveOutSettlementController.getSettlementByContractId);

// GET settlement by ID
router.get('/:id', moveOutSettlementController.getSettlementById);

// POST create settlement
router.post('/', moveOutSettlementController.createSettlement);

// PUT update settlement
router.put('/:id', moveOutSettlementController.updateSettlement);

// DELETE settlement
router.delete('/:id', moveOutSettlementController.deleteSettlement);

module.exports = router;
