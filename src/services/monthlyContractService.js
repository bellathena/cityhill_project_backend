const prisma = require('../utils/prisma');

/**
 * MonthlyContract Service
 */

const monthlyContractService = {
  getAllMonthlyContracts: async () => {
    return await prisma.monthlyContract.findMany({
      include: {
        customer: true,
        room: true,
        invoices: true,
        checks_contract: true,
        moveOutSettlement: true
      }
    });
  },

  getMonthlyContractById: async (id) => {
    return await prisma.monthlyContract.findUnique({
      where: { id },
      include: {
        customer: true,
        room: true,
        invoices: true,
        checks_contract: true,
        moveOutSettlement: true
      }
    });
  },

  createMonthlyContract: async (data) => {
    return await prisma.monthlyContract.create({
      data: {
        customerId: parseInt(data.customerId),
        roomId: parseInt(data.roomId),
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        depositAmount: parseInt(data.depositAmount),
        advancePayment: parseInt(data.advancePayment),
        monthlyRentRate: parseInt(data.monthlyRentRate),
        contractStatus: data.contractStatus || 'ACTIVE',
        contractFile: data.contractFile
      }
    });
  },

  updateMonthlyContract: async (id, data) => {
    // Build update object with only provided fields
    const updateData = {};
    
    if (data.customerId !== undefined) updateData.customerId = parseInt(data.customerId);
    if (data.roomId !== undefined) updateData.roomId = parseInt(data.roomId);
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.depositAmount !== undefined) updateData.depositAmount = parseInt(data.depositAmount);
    if (data.advancePayment !== undefined) updateData.advancePayment = parseInt(data.advancePayment);
    if (data.monthlyRentRate !== undefined) updateData.monthlyRentRate = parseInt(data.monthlyRentRate);
    if (data.contractStatus !== undefined) updateData.contractStatus = data.contractStatus;
    if (data.contractFile !== undefined) updateData.contractFile = data.contractFile;

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.monthlyContract.update({
      where: { id },
      data: updateData
    });
  },

  deleteMonthlyContract: async (id) => {
    return await prisma.monthlyContract.delete({
      where: { id }
    });
  }
};

module.exports = monthlyContractService;
