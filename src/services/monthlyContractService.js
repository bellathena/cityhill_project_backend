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
    const roomId = parseInt(data.roomId);
    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;

    // Use transaction to create both MonthlyContract and RoomAvailability records
    const contract = await prisma.$transaction(async (tx) => {
      // Create MonthlyContract
      const monthlyContract = await tx.monthlyContract.create({
        data: {
          customerId: parseInt(data.customerId),
          roomId: roomId,
          startDate: startDate,
          endDate: endDate,
          depositAmount: parseInt(data.depositAmount),
          advancePayment: parseInt(data.advancePayment),
          monthlyRentRate: parseInt(data.monthlyRentRate),
          contractStatus: data.contractStatus || 'ACTIVE',
          contractFile: data.contractFile
        }
      });

      // Create RoomAvailability records for each day in the contract period
      const currentDate = new Date(startDate);
      const contractEnd = endDate || new Date(startDate.getFullYear(), startDate.getMonth() + 12, startDate.getDate());
      const availabilityRecords = [];
      
      while (currentDate < contractEnd) {
        availabilityRecords.push({
          roomId: roomId,
          checkDate: new Date(currentDate),
          referenceId: monthlyContract.id,
          refType: 'Monthly',
          status: 'OCCUPIED'
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Upsert availability records (create or update if exists)
      for (const record of availabilityRecords) {
        await tx.roomAvailability.upsert({
          where: {
            roomId_checkDate: {
              roomId: record.roomId,
              checkDate: record.checkDate
            }
          },
          create: record,
          update: {
            referenceId: record.referenceId,
            refType: record.refType,
            status: record.status
          }
        });
      }

      return monthlyContract;
    });

    return contract;
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
    // Get the contract first to know which dates to clean up
    const contract = await prisma.monthlyContract.findUnique({
      where: { id }
    });

    if (!contract) {
      const error = new Error('Monthly contract not found');
      error.status = 404;
      throw error;
    }

    // Use transaction to delete contract and update RoomAvailability
    return await prisma.$transaction(async (tx) => {
      // Delete the MonthlyContract
      await tx.monthlyContract.delete({
        where: { id }
      });

      // Delete RoomAvailability records for this contract
      await tx.roomAvailability.deleteMany({
        where: {
          referenceId: id,
          refType: 'Monthly'
        }
      });
    });
  }
};

module.exports = monthlyContractService;
