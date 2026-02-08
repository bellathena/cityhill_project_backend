const prisma = require('../utils/prisma');

/**
 * Invoice Service
 */

const invoiceService = {
  getAllInvoices: async () => {
    return await prisma.invoice.findMany({
      include: {
        dailyBooking: {
          include: {
            customer: true,
            room: true
          }
        },
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
        dailyBooking: {
          include: {
            customer: true,
            room: true
          }
        },
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
    // Validate either dailyBookingId or monthlyContractId is provided, not both and not neither
    if ((!data.dailyBookingId && !data.monthlyContractId) || (data.dailyBookingId && data.monthlyContractId)) {
      const error = new Error('Provide either dailyBookingId or monthlyContractId, but not both');
      error.status = 400;
      throw error;
    }

    // Validate dailyBookingId if provided
    if (data.dailyBookingId) {
      const booking = await prisma.dailyBooking.findUnique({
        where: { id: parseInt(data.dailyBookingId) }
      });
      if (!booking) {
        const error = new Error('Daily booking not found');
        error.status = 404;
        throw error;
      }
    }

    // Validate monthlyContractId if provided
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
        dailyBookingId: data.dailyBookingId ? parseInt(data.dailyBookingId) : null,
        monthlyContractId: data.monthlyContractId ? parseInt(data.monthlyContractId) : null,
        invoiceDate: new Date(data.invoiceDate),
        dueDate: new Date(data.dueDate),
        rentAmount: parseFloat(data.rentAmount),
        electricFee: data.electricFee ? parseFloat(data.electricFee) : null,
        waterFee: data.waterFee ? parseFloat(data.waterFee) : null,
        serviceFee: data.serviceFee ? parseFloat(data.serviceFee) : null,
        discount: data.discount ? parseFloat(data.discount) : null,
        grandTotal: parseFloat(data.grandTotal),
        paymentStatus: data.paymentStatus || 'PENDING'
      },
      include: {
        dailyBooking: {
          include: {
            customer: true,
            room: true
          }
        },
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
    // Build update object with only provided fields
    const updateData = {};
    
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
      data: updateData,
      include: {
        dailyBooking: {
          include: {
            customer: true,
            room: true
          }
        },
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
