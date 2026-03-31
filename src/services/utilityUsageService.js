const prisma = require('../utils/prisma');

const utilityUsageService = {
  getAllUsages: async () => {
    return await prisma.utilityUsage.findMany({
      include: {
        room: true,
        utilityType: true
      }
    });
  },

  getUsageById: async (id) => {
    return await prisma.utilityUsage.findUnique({
      where: { id },
      include: {
        room: true,
        utilityType: true
      }
    });
  },

  getUsagesByRoom: async (roomId) => {
    return await prisma.utilityUsage.findMany({
      where: { roomId: parseInt(roomId) },
      include: {
        room: true,
        utilityType: true
      },
      orderBy: { recordDate: 'desc' }
    });
  },

  createUsage: async (data) => {
    const roomId = parseInt(data.roomId);
    const uTypeId = parseInt(data.uTypeId);
    const month = parseInt(data.month);
    const year = parseInt(data.year);

    const existing = await prisma.utilityUsage.findFirst({
      where: { roomId, uTypeId, month, year }
    });
    if (existing) {
      const error = new Error(`Utility usage for this room, type, and month already exists`);
      error.status = 400;
      throw error;
    }

    return await prisma.utilityUsage.create({
      data: {
        roomId,
        month,
        year,
        recordDate: new Date(data.recordDate),
        utilityUnit: parseFloat(data.utilityUnit),
        uTypeId
      },
      include: {
        room: true,
        utilityType: true
      }
    });
  },

  updateUsage: async (id, data) => {
    const updateData = {};

    if (data.roomId !== undefined) updateData.roomId = parseInt(data.roomId);
    if (data.month !== undefined) updateData.month = parseInt(data.month);
    if (data.year !== undefined) updateData.year = parseInt(data.year);
    if (data.recordDate !== undefined) updateData.recordDate = new Date(data.recordDate);
    if (data.utilityUnit !== undefined) updateData.utilityUnit = parseFloat(data.utilityUnit);
    if (data.uTypeId !== undefined) updateData.uTypeId = parseInt(data.uTypeId);

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.utilityUsage.update({
      where: { id },
      data: updateData,
      include: {
        room: true,
        utilityType: true
      }
    });
  },

  deleteUsage: async (id) => {
    return await prisma.utilityUsage.delete({
      where: { id }
    });
  }
};

module.exports = utilityUsageService;
