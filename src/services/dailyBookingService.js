const prisma = require('../utils/prisma');

/**
 * DailyBooking Service
 */

const dailyBookingService = {
  getAllDailyBookings: async () => {
    return await prisma.dailyBooking.findMany({
      include: {
        customer: true,
        room: true,
        invoices: true,
        checks_daily: true
      }
    });
  },

  getDailyBookingById: async (id) => {
    return await prisma.dailyBooking.findUnique({
      where: { id },
      include: {
        customer: true,
        room: true,
        invoices: true,
        checks_daily: true
      }
    });
  },

  createDailyBooking: async (data) => {
    return await prisma.dailyBooking.create({
      data: {
        customerId: parseInt(data.customerId),
        roomId: parseInt(data.roomId),
        checkInDate: new Date(data.checkInDate),
        checkOutDate: new Date(data.checkOutDate),
        numGuests: data.numGuests ? parseInt(data.numGuests) : null,
        extraBedCount: data.extraBedCount ? parseInt(data.extraBedCount) : null,
        totalAmount: parseFloat(data.totalAmount),
        bookingStatus: data.bookingStatus || 'CONFIRMED',
        paymentStatus: data.paymentStatus || 'PENDING'
      }
    });
  },

  updateDailyBooking: async (id, data) => {
    // Build update object with only provided fields
    const updateData = {};
    
    if (data.customerId !== undefined) updateData.customerId = parseInt(data.customerId);
    if (data.roomId !== undefined) updateData.roomId = parseInt(data.roomId);
    if (data.checkInDate !== undefined) updateData.checkInDate = new Date(data.checkInDate);
    if (data.checkOutDate !== undefined) updateData.checkOutDate = new Date(data.checkOutDate);
    if (data.numGuests !== undefined) updateData.numGuests = data.numGuests ? parseInt(data.numGuests) : null;
    if (data.extraBedCount !== undefined) updateData.extraBedCount = data.extraBedCount ? parseInt(data.extraBedCount) : null;
    if (data.totalAmount !== undefined) updateData.totalAmount = parseFloat(data.totalAmount);
    if (data.bookingStatus !== undefined) updateData.bookingStatus = data.bookingStatus;
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.dailyBooking.update({
      where: { id },
      data: updateData
    });
  },

  deleteDailyBooking: async (id) => {
    return await prisma.dailyBooking.delete({
      where: { id }
    });
  }
};

module.exports = dailyBookingService;
