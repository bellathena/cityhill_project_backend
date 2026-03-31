const prisma = require('../utils/prisma');

const utilitiesService = {
  getAllUtilities: async () => {
    return await prisma.utilities.findMany({
      include: { usages: true }
    });
  },

  getUtilityById: async (id) => {
    return await prisma.utilities.findUnique({
      where: { id },
      include: { usages: true }
    });
  },

  createUtility: async (data) => {
    return await prisma.utilities.create({
      data: {
        uType: data.uType,
        ratePerUnit: parseFloat(data.ratePerUnit)
      }
    });
  },

  updateUtility: async (id, data) => {
    const updateData = {};

    if (data.uType !== undefined) updateData.uType = data.uType;
    if (data.ratePerUnit !== undefined) updateData.ratePerUnit = parseFloat(data.ratePerUnit);

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.utilities.update({
      where: { id },
      data: updateData
    });
  },

  deleteUtility: async (id) => {
    return await prisma.utilities.delete({
      where: { id }
    });
  }
};

module.exports = utilitiesService;
