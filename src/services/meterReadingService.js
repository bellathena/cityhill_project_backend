const prisma = require('../utils/prisma');

/**
 * MeterReading Service
 */

const meterReadingService = {
  getAllMeterReadings: async () => {
    return await prisma.meterReading.findMany({
      include: {
        room: true
      }
    });
  },

  getMeterReadingById: async (id) => {
    return await prisma.meterReading.findUnique({
      where: { id },
      include: {
        room: true
      }
    });
  },

  getMeterReadingByRoomAndMonth: async (roomId, month, year) => {
    return await prisma.meterReading.findUnique({
      where: {
        roomId_month_year: {
          roomId,
          month,
          year
        }
      }
    });
  },

  createMeterReading: async (data) => {
    return await prisma.meterReading.create({
      data: {
        roomId: parseInt(data.roomId),
        month: parseInt(data.month),
        year: parseInt(data.year),
        previousElectric: parseFloat(data.previousElectric),
        currentElectric: parseFloat(data.currentElectric),
        previousWater: parseFloat(data.previousWater),
        currentWater: parseFloat(data.currentWater),
        readingDate: new Date(data.readingDate)
      }
    });
  },

  updateMeterReading: async (roomId, month, year, data) => {
    // Build update object with only provided fields
    const updateData = {};
    
    if (data.previousElectric !== undefined) updateData.previousElectric = parseFloat(data.previousElectric);
    if (data.currentElectric !== undefined) updateData.currentElectric = parseFloat(data.currentElectric);
    if (data.previousWater !== undefined) updateData.previousWater = parseFloat(data.previousWater);
    if (data.currentWater !== undefined) updateData.currentWater = parseFloat(data.currentWater);
    if (data.readingDate !== undefined) updateData.readingDate = new Date(data.readingDate);

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.meterReading.update({
      where: {
        roomId_month_year: {
          roomId,
          month,
          year
        }
      },
      data: updateData,
      include: {
        room: true
      }
    });
  },

  deleteMeterReading: async (id) => {
    return await prisma.meterReading.delete({
      where: { id }
    });
  }
};

module.exports = meterReadingService;
