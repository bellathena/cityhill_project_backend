const prisma = require('../utils/prisma');

const invoiceService = {
  getAllInvoices: async () => {
    return await prisma.invoice.findMany({
      include: {
        monthlyContract: {
          include: {
            customer: true,
            room: true
          }
        },
        payments: true
      }
    });
  },

  getInvoiceById: async (id) => {
    return await prisma.invoice.findUnique({
      where: { id },
      include: {
        monthlyContract: {
          include: {
            customer: true,
            room: true
          }
        },
        payments: true
      }
    });
  },

  createInvoice: async (data) => {
    if (data.monthlyContractId) {
      const contract = await prisma.monthlyContract.findUnique({
        where: { id: parseInt(data.monthlyContractId) }
      });
      if (!contract) {
        const error = new Error('Monthly contract not found');
        error.status = 404;
        throw error;
      }
    }

    return await prisma.invoice.create({
      data: {
        monthlyContractId: data.monthlyContractId ? parseInt(data.monthlyContractId) : null,
        invoiceDate: new Date(data.invoiceDate),
        dueDate: new Date(data.dueDate),
        grandTotal: parseFloat(data.grandTotal),
        paymentStatus: data.paymentStatus || 'PENDING'
      },
      include: {
        monthlyContract: {
          include: {
            customer: true,
            room: true
          }
        },
        payments: true
      }
    });
  },

  updateInvoice: async (id, data) => {
    const updateData = {};

    if (data.monthlyContractId !== undefined) updateData.monthlyContractId = data.monthlyContractId ? parseInt(data.monthlyContractId) : null;
    if (data.invoiceDate !== undefined) updateData.invoiceDate = new Date(data.invoiceDate);
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
    if (data.grandTotal !== undefined) updateData.grandTotal = parseFloat(data.grandTotal);
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        monthlyContract: {
          include: {
            customer: true,
            room: true
          }
        },
        payments: true
      }
    });
  },

  deleteInvoice: async (id) => {
    return await prisma.invoice.delete({
      where: { id }
    });
  }
};

module.exports = invoiceService;
