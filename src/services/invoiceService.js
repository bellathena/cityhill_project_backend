const prisma = require('../utils/prisma');

/**
 * Invoice Service
 */

const invoiceService = {
  getAllInvoices: async () => {
    return await prisma.invoice.findMany({
      include: {
        dailyBooking: true,
        monthlyContract: true,
        payments: true
      }
    });
  },

  getInvoiceById: async (id) => {
    return await prisma.invoice.findUnique({
      where: { id },
      include: {
        dailyBooking: true,
        monthlyContract: true,
        payments: true
      }
    });
  },

  createInvoice: async (data) => {
    return await prisma.invoice.create({
      data: {
        referenceId: parseInt(data.referenceId),
        refType: data.refType,
        invoiceDate: new Date(data.invoiceDate),
        dueDate: new Date(data.dueDate),
        rentAmount: parseFloat(data.rentAmount),
        electricFee: data.electricFee ? parseFloat(data.electricFee) : null,
        waterFee: data.waterFee ? parseFloat(data.waterFee) : null,
        serviceFee: data.serviceFee ? parseFloat(data.serviceFee) : null,
        discount: data.discount ? parseFloat(data.discount) : null,
        grandTotal: parseFloat(data.grandTotal),
        paymentStatus: data.paymentStatus || 'PENDING'
      }
    });
  },

  updateInvoice: async (id, data) => {
    // Build update object with only provided fields
    const updateData = {};
    
    if (data.referenceId !== undefined) updateData.referenceId = parseInt(data.referenceId);
    if (data.refType !== undefined) updateData.refType = data.refType;
    if (data.invoiceDate !== undefined) updateData.invoiceDate = new Date(data.invoiceDate);
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
    if (data.rentAmount !== undefined) updateData.rentAmount = parseFloat(data.rentAmount);
    if (data.electricFee !== undefined) updateData.electricFee = data.electricFee ? parseFloat(data.electricFee) : null;
    if (data.waterFee !== undefined) updateData.waterFee = data.waterFee ? parseFloat(data.waterFee) : null;
    if (data.serviceFee !== undefined) updateData.serviceFee = data.serviceFee ? parseFloat(data.serviceFee) : null;
    if (data.discount !== undefined) updateData.discount = data.discount ? parseFloat(data.discount) : null;
    if (data.grandTotal !== undefined) updateData.grandTotal = parseFloat(data.grandTotal);
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.invoice.update({
      where: { id },
      data: updateData
    });
  },

  deleteInvoice: async (id) => {
    return await prisma.invoice.delete({
      where: { id }
    });
  }
};

module.exports = invoiceService;
