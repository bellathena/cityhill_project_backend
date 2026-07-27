import prisma from '../utils/prisma.js';
import { recalculateInvoicesForUtilityType } from './invoiceRecalculationService.js';

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

    const shouldRecalculateInvoices = data.ratePerUnit !== undefined;

    return await prisma.$transaction(async (tx) => {
      const utility = await tx.utilities.update({
        where: { id },
        data: updateData
      });

      if (shouldRecalculateInvoices) {
        await recalculateInvoicesForUtilityType(tx, id);
      }

      return utility;
    });
  },

  deleteUtility: async (id) => {
    return await prisma.utilities.delete({
      where: { id }
    });
  }
};

export default utilitiesService;
