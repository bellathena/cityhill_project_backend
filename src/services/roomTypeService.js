const prisma = require('../utils/prisma');

/**
 * RoomType Service
 */

const roomTypeService = {
  getAllRoomTypes: async () => {
    return await prisma.roomType.findMany({
      include: {
        rooms: true
      }
    });
  },

  getRoomTypeById: async (id) => {
    return await prisma.roomType.findUnique({
      where: { id },
      include: {
        rooms: true
      }
    });
  },

  createRoomType: async (data) => {
    return await prisma.roomType.create({
      data: {
        typeName: data.typeName,
        description: data.description,
        baseMonthlyRate: parseInt(data.baseMonthlyRate),
        baseDailyRate: parseInt(data.baseDailyRate)
      }
    });
  },

  updateRoomType: async (id, data) => {
    // Build update object with only provided fields
    const updateData = {};
    
    if (data.typeName !== undefined) updateData.typeName = data.typeName;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.baseMonthlyRate !== undefined) updateData.baseMonthlyRate = parseInt(data.baseMonthlyRate);
    if (data.baseDailyRate !== undefined) updateData.baseDailyRate = parseInt(data.baseDailyRate);

    // Don't update if no fields provided
    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.roomType.update({
      where: { id },
      data: updateData
    });
  },

  deleteRoomType: async (id) => {
    return await prisma.roomType.delete({
      where: { id }
    });
  }
};

module.exports = roomTypeService;
