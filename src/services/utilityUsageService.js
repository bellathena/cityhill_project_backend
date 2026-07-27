import prisma from '../utils/prisma.js';
import { recalculateInvoicesForRoomMonth } from './invoiceRecalculationService.js';

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

    return await prisma.$transaction(async (tx) => {
      const existing = await tx.utilityUsage.findFirst({
        where: { roomId, uTypeId, month, year }
      });
      if (existing) {
        const error = new Error(`Utility usage for this room, type, and month already exists`);
        error.status = 400;
        throw error;
      }

      const usage = await tx.utilityUsage.create({
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

      await recalculateInvoicesForRoomMonth(tx, roomId, month, year);

      return usage;
    });
  },

  updateUsage: async (id, data) => {
    return await prisma.$transaction(async (tx) => {
      const currentUsage = await tx.utilityUsage.findUnique({
        where: { id },
        include: { utilityType: true }
      });
      if (!currentUsage) {
        const error = new Error('Utility usage not found');
        error.status = 404;
        throw error;
      }

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

      const usage = await tx.utilityUsage.update({
        where: { id },
        data: updateData,
        include: {
          room: true,
          utilityType: true
        }
      });

      const isSamePeriod =
        currentUsage.roomId === usage.roomId &&
        currentUsage.month === usage.month &&
        currentUsage.year === usage.year;

      if (!isSamePeriod) {
        await recalculateInvoicesForRoomMonth(tx, currentUsage.roomId, currentUsage.month, currentUsage.year);
      }
      await recalculateInvoicesForRoomMonth(tx, usage.roomId, usage.month, usage.year);

      return usage;
    });
  },

  deleteUsage: async (id) => {
    return await prisma.$transaction(async (tx) => {
      const currentUsage = await tx.utilityUsage.findUnique({
        where: { id },
        include: { utilityType: true }
      });
      if (!currentUsage) {
        const error = new Error('Utility usage not found');
        error.status = 404;
        throw error;
      }

      const deleted = await tx.utilityUsage.delete({
        where: { id }
      });

      await recalculateInvoicesForRoomMonth(
        tx,
        currentUsage.roomId,
        currentUsage.month,
        currentUsage.year
      );

      return deleted;
    });
  }
};

export default utilityUsageService;
