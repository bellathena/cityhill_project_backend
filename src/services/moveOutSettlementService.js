const prisma = require('../utils/prisma');

/**
 * MoveOutSettlement Service
 */

const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  return parseFloat(value);
};

const round2 = (value) => Math.round(value * 100) / 100;

const parseContractId = (contractId) => {
  const parsed = parseInt(contractId, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    const error = new Error('Invalid contractId');
    error.status = 400;
    throw error;
  }

  return parsed;
};

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
    const parsedContractId = parseContractId(contractId);

    return await prisma.moveOutSettlement.findUnique({
      where: { contractId: parsedContractId },
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

  getOutstandingBalanceByContractId: async (contractId) => {
    const parsedContractId = parseContractId(contractId);

    const contract = await prisma.monthlyContract.findUnique({
      where: { id: parsedContractId }
    });

    if (!contract) {
      const error = new Error('Monthly contract not found');
      error.status = 404;
      throw error;
    }

    const invoices = await prisma.invoice.findMany({
      where: { monthlyContractId: parsedContractId },
      include: { payments: true }
    });

    const totalInvoiced = invoices.reduce((sum, invoice) => {
      return sum + toNumber(invoice.grandTotal);
    }, 0);

    const totalPaid = invoices.reduce((sum, invoice) => {
      const paidPerInvoice = invoice.payments.reduce((paymentSum, payment) => {
        return paymentSum + toNumber(payment.amountPaid);
      }, 0);

      return sum + paidPerInvoice;
    }, 0);

    const outstandingBalance = Math.max(round2(totalInvoiced - totalPaid), 0);

    return {
      contractId: parsedContractId,
      totalInvoiced: round2(totalInvoiced),
      totalPaid: round2(totalPaid),
      outstandingBalance
    };
  },

  createSettlement: async (data) => {
    const parsedContractId = parseContractId(data.contractId);

    // Validate contractId exists
    const contract = await prisma.monthlyContract.findUnique({
      where: { id: parsedContractId }
    });
    if (!contract) {
      const error = new Error('Monthly contract not found');
      error.status = 404;
      throw error;
    }

    // Check if settlement already exists for this contract
    const existing = await prisma.moveOutSettlement.findUnique({
      where: { contractId: parsedContractId }
    });
    if (existing) {
      const error = new Error('Settlement already exists for this contract');
      error.status = 400;
      throw error;
    }

    return await prisma.$transaction(async (tx) => {
      const outstandingInfo = await moveOutSettlementService.getOutstandingBalanceByContractId(data.contractId);

      const calculatedOutstandingBalance =
        data.outstandingBalance !== undefined && data.outstandingBalance !== null
          ? parseFloat(data.outstandingBalance)
          : outstandingInfo.outstandingBalance; 

      const damageDeduction = data.damageDeduction ? parseFloat(data.damageDeduction) : 0;
      const cleaningFee = data.cleaningFee ? parseFloat(data.cleaningFee) : 0;
      const totalDeposit = parseFloat(data.totalDeposit);
      const calculatedNetRefund =
        data.netRefund !== undefined && data.netRefund !== null
          ? parseFloat(data.netRefund)
          : round2(totalDeposit - damageDeduction - cleaningFee - calculatedOutstandingBalance);

      const settlement = await tx.moveOutSettlement.create({
        data: {
          contractId: parsedContractId,
          moveOutDate: new Date(data.moveOutDate),
          totalDeposit,
          damageDeduction: data.damageDeduction ? parseFloat(data.damageDeduction) : null,
          cleaningFee: data.cleaningFee ? parseFloat(data.cleaningFee) : null,
          outstandingBalance: calculatedOutstandingBalance,
          netRefund: calculatedNetRefund,
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

      // Update room status to AVAILABLE and contract status to CLOSED
      await tx.room.update({
        where: { roomNumber: contract.roomId },
        data: { currentStatus: 'AVAILABLE' }
      });

      await tx.monthlyContract.update({
        where: { id: contract.id },
        data: { contractStatus: 'CLOSED' }
      });

      return settlement;
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
