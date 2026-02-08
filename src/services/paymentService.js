const prisma = require('../utils/prisma');

/**
 * Payment Service
 */

const paymentService = {
  getAllPayments: async () => {
    return await prisma.payment.findMany({
      include: {
        invoice: true
      }
    });
  },

  getPaymentById: async (id) => {
    return await prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: true
      }
    });
  },

  createPayment: async (data) => {
    return await prisma.payment.create({
      data: {
        invoiceId: parseInt(data.invoiceId),
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
        paymentMethod: data.paymentMethod,
        amountPaid: parseFloat(data.amountPaid),
        slipImage: data.slipImage
      }
    });
  },

  updatePayment: async (id, data) => {
    // Build update object with only provided fields
    const updateData = {};
    
    if (data.invoiceId !== undefined) updateData.invoiceId = parseInt(data.invoiceId);
    if (data.paymentDate !== undefined) updateData.paymentDate = new Date(data.paymentDate);
    if (data.paymentMethod !== undefined) updateData.paymentMethod = data.paymentMethod;
    if (data.amountPaid !== undefined) updateData.amountPaid = parseFloat(data.amountPaid);
    if (data.slipImage !== undefined) updateData.slipImage = data.slipImage;

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.payment.update({
      where: { id },
      data: updateData
    });
  },

  deletePayment: async (id) => {
    return await prisma.payment.delete({
      where: { id }
    });
  }
};

module.exports = paymentService;
