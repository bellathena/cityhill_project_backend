const moveOutSettlementService = require('../services/moveOutSettlementService');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * MoveOutSettlement Controller
 */

const moveOutSettlementController = {
  // GET /api/move-out-settlements - Get all settlements
  getAllSettlements: asyncHandler(async (req, res) => {
    const data = await moveOutSettlementService.getAllSettlements();
    res.json(
      data
    );
  }),

  // GET /api/move-out-settlements/:id - Get settlement by ID
  getSettlementById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await moveOutSettlementService.getSettlementById(parseInt(id));

    if (!data) {
      const error = new Error('Settlement not found');
      error.status = 404;
      throw error;
    }

    res.json(
      data
    );
  }),

  // GET /api/move-out-settlements/contract/:contractId - Get settlement by contract ID
  getSettlementByContractId: asyncHandler(async (req, res) => {
    const { contractId } = req.params;
    const data = await moveOutSettlementService.getSettlementByContractId(contractId);

    if (!data) {
      const error = new Error('Settlement not found for this contract');
      error.status = 404;
      throw error;
    }

    res.json(
      data
    );
  }),

  // POST /api/move-out-settlements - Create settlement
  createSettlement: asyncHandler(async (req, res) => {
    const { contractId, moveOutDate, totalDeposit, damageDeduction, cleaningFee, outstandingBalance, netRefund, refundStatus } = req.body;

    // Validate required fields
    if (!contractId || !moveOutDate || totalDeposit === undefined || netRefund === undefined) {
      const error = new Error('contractId, moveOutDate, totalDeposit, and netRefund are required');
      error.status = 400;
      throw error;
    }

    const data = await moveOutSettlementService.createSettlement({
      contractId,
      moveOutDate,
      totalDeposit,
      damageDeduction,
      cleaningFee,
      outstandingBalance,
      netRefund,
      refundStatus
    });

    res.status(201).json(
      data
    );
  }),

  // PUT /api/move-out-settlements/:id - Update settlement
  updateSettlement: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await moveOutSettlementService.updateSettlement(parseInt(id), req.body);

    res.json({
      success: true,
      data
    });
  }),

  // DELETE /api/move-out-settlements/:id - Delete settlement
  deleteSettlement: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await moveOutSettlementService.deleteSettlement(parseInt(id));

    res.json({
      success: true,
      message: 'Settlement deleted successfully'
    });
  })
};

module.exports = moveOutSettlementController;
