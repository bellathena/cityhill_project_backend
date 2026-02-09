const prisma = require('../utils/prisma');

/**
 * UtilityRate Service
 */

const utilityRateService = {
  getAllUtilityRates: async () => {
    return await prisma.utilityRate.findMany({
      orderBy: {
        effectiveDate: 'desc'
      }
    });
  },

  getUtilityRateById: async (id) => {
    return await prisma.utilityRate.findUnique({
      where: { id }
    });
  },

  getLatestUtilityRate: async () => {
    return await prisma.utilityRate.findFirst({
      orderBy: {
        effectiveDate: 'desc'
      }
    });
  },

  createUtilityRate: async (data) => {
    return await prisma.utilityRate.create({
      data: {
        electricityRate: parseFloat(data.electricityRate),
        waterRate: parseFloat(data.waterRate),
        effectiveDate: new Date(data.effectiveDate)
      }
    });
  },

  updateUtilityRate: async (id, data) => {
    const updateData = {};

    if (data.electricityRate !== undefined) updateData.electricityRate = parseFloat(data.electricityRate);
    if (data.waterRate !== undefined) updateData.waterRate = parseFloat(data.waterRate);
    if (data.effectiveDate !== undefined) updateData.effectiveDate = new Date(data.effectiveDate);

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.utilityRate.update({
      where: { id },
      data: updateData
    });
  },

  deleteUtilityRate: async (id) => {
    return await prisma.utilityRate.delete({
      where: { id }
    });
  }
};

module.exports = utilityRateService;
