const prisma = require("../utils/prisma");

const monthlyContractService = {
  getAllMonthlyContracts: async () => {
    return await prisma.monthlyContract.findMany({
      include: {
        customer: true,
        room: true,
        invoices: true,
        moveOutSettlement: true,
      },
    });
  },

  getMonthlyContractById: async (id) => {
    return await prisma.monthlyContract.findUnique({
      where: { id },
      include: {
        customer: true,
        room: true,
        invoices: true,
        moveOutSettlement: true,
      },
    });
  },

  createMonthlyContract: async (data) => {
    const roomId = parseInt(data.roomId);
    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;

    return await prisma.$transaction(async (tx) => {
      const monthlyContract = await tx.monthlyContract.create({
        data: {
          customerId: parseInt(data.customerId),
          roomId: roomId,
          startDate: startDate,
          endDate: endDate,
          depositAmount: parseInt(data.depositAmount),
          advancePayment: parseInt(data.advancePayment),
          monthlyRentRate: parseInt(data.monthlyRentRate),
          contractStatus: data.contractStatus || "ACTIVE",
          contractFile: data.contractFile,
        },
      });

      await tx.room.update({
        where: { roomNumber: roomId },
        data: { currentStatus: "OCCUPIED_M" },
      });

      return monthlyContract;
    });
  },

  updateMonthlyContract: async (id, data) => {
    const currentContract = await prisma.monthlyContract.findUnique({
      where: { id },
    });

    if (!currentContract) {
      const error = new Error("Monthly contract not found");
      error.status = 404;
      throw error;
    }

    const updateData = {};

    if (data.customerId !== undefined)
      updateData.customerId = parseInt(data.customerId);
    if (data.roomId !== undefined) updateData.roomId = parseInt(data.roomId);
    if (data.startDate !== undefined)
      updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined)
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.depositAmount !== undefined)
      updateData.depositAmount = parseInt(data.depositAmount);
    if (data.advancePayment !== undefined)
      updateData.advancePayment = parseInt(data.advancePayment);
    if (data.monthlyRentRate !== undefined)
      updateData.monthlyRentRate = parseInt(data.monthlyRentRate);
    if (data.contractStatus !== undefined)
      updateData.contractStatus = data.contractStatus;
    if (data.contractFile !== undefined)
      updateData.contractFile = data.contractFile;

    if (Object.keys(updateData).length === 0) {
      const error = new Error("No fields to update");
      error.status = 400;
      throw error;
    }

    return await prisma.$transaction(async (tx) => {
      const updatedContract = await tx.monthlyContract.update({
        where: { id },
        data: updateData,
      });

      const roomId =
        updateData.roomId !== undefined
          ? updateData.roomId
          : currentContract.roomId;

      if (data.contractStatus === "CLOSED") {
        await tx.room.update({
          where: { roomNumber: roomId },
          data: { currentStatus: "AVAILABLE" },
        });
      } else if (data.contractStatus === "ACTIVE") {
        await tx.room.update({
          where: { roomNumber: roomId },
          data: { currentStatus: "OCCUPIED_M" },
        });
      } else if (
        data.roomId !== undefined &&
        data.roomId !== currentContract.roomId
      ) {
        await tx.room.update({
          where: { roomNumber: parseInt(data.roomId) },
          data: { currentStatus: "OCCUPIED_M" },
        });
        await tx.room.update({
          where: { roomNumber: currentContract.roomId },
          data: { currentStatus: "AVAILABLE" },
        });
      }

      return updatedContract;
    });
  },

  deleteMonthlyContract: async (id) => {
    const contract = await prisma.monthlyContract.findUnique({
      where: { id },
    });

    if (!contract) {
      const error = new Error("Monthly contract not found");
      error.status = 404;
      throw error;
    }

    return await prisma.$transaction(async (tx) => {
      await tx.monthlyContract.delete({ where: { id } });

      await tx.room.update({
        where: { roomNumber: contract.roomId },
        data: { currentStatus: "AVAILABLE" },
      });
    });
  },
};

module.exports = monthlyContractService;
