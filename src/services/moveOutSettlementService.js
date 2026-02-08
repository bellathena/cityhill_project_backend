const prisma = require('../utils/prisma');

/**
 * MoveOutSettlement Service
 */

const moveOutSettlementService = {
  getAllSettlements: async () => {
    return await prisma.moveOutSettlement.findMany({
      include: {
        contract: {
          include: {
            customer: true,
            room: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  getSettlementById: async (id) => {
    return await prisma.moveOutSettlement.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            customer: true,
            room: true
          }
        }
      }
    });
  },

  getSettlementByContractId: async (contractId) => {
    return await prisma.moveOutSettlement.findUnique({
      where: { contractId: parseInt(contractId) },
      include: {
        contract: {
          include: {
            customer: true,
            room: true
          }
        }
      }
    });
  },

  createSettlement: async (data) => {
    // Validate contractId exists
    const contract = await prisma.monthlyContract.findUnique({
      where: { id: parseInt(data.contractId) }
    });
    if (!contract) {
      const error = new Error('Monthly contract not found');
      error.status = 404;
      throw error;
    }

    // Check if settlement already exists for this contract
    const existing = await prisma.moveOutSettlement.findUnique({
      where: { contractId: parseInt(data.contractId) }
    });
    if (existing) {
      const error = new Error('Settlement already exists for this contract');
      error.status = 400;
      throw error;
    }

    return await prisma.moveOutSettlement.create({
      data: {
        contractId: parseInt(data.contractId),
        moveOutDate: new Date(data.moveOutDate),
        totalDeposit: parseFloat(data.totalDeposit),
        damageDeduction: data.damageDeduction ? parseFloat(data.damageDeduction) : null,
        cleaningFee: data.cleaningFee ? parseFloat(data.cleaningFee) : null,
        outstandingBalance: data.outstandingBalance ? parseFloat(data.outstandingBalance) : null,
        netRefund: parseFloat(data.netRefund),
        refundStatus: data.refundStatus || 'PENDING'
      },
      include: {
        contract: {
          include: {
            customer: true,
            room: true
          }
        }
      }
    });
  },

  updateSettlement: async (id, data) => {
    // Build update object with only provided fields
    const updateData = {};

    if (data.moveOutDate !== undefined) updateData.moveOutDate = new Date(data.moveOutDate);
    if (data.totalDeposit !== undefined) updateData.totalDeposit = parseFloat(data.totalDeposit);
    if (data.damageDeduction !== undefined) updateData.damageDeduction = data.damageDeduction ? parseFloat(data.damageDeduction) : null;
    if (data.cleaningFee !== undefined) updateData.cleaningFee = data.cleaningFee ? parseFloat(data.cleaningFee) : null;
    if (data.outstandingBalance !== undefined) updateData.outstandingBalance = data.outstandingBalance ? parseFloat(data.outstandingBalance) : null;
    if (data.netRefund !== undefined) updateData.netRefund = parseFloat(data.netRefund);
    if (data.refundStatus !== undefined) updateData.refundStatus = data.refundStatus;

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.moveOutSettlement.update({
      where: { id },
      data: updateData,
      include: {
        contract: {
          include: {
            customer: true,
            room: true
          }
        }
      }
    });
  },

  deleteSettlement: async (id) => {
    return await prisma.moveOutSettlement.delete({
      where: { id }
    });
  }
};

module.exports = moveOutSettlementService;
