const prisma = require('../utils/prisma');

const dailyBookingService = {
  getAllDailyBookings: async () => {
    return await prisma.dailyBooking.findMany({
      include: {
        customer: true,
        room: true
      }
    });
  },

  getDailyBookingById: async (id) => {
    return await prisma.dailyBooking.findUnique({
      where: { id },
      include: {
        customer: true,
        room: true
      }
    });
  },

  createDailyBooking: async (data) => {
    const roomId = parseInt(data.roomId);
    const checkInDate = new Date(data.checkInDate);
    const checkOutDate = new Date(data.checkOutDate);

    return await prisma.$transaction(async (tx) => {
      const dailyBooking = await tx.dailyBooking.create({
        data: {
          customerId: parseInt(data.customerId),
          roomId: roomId,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          numGuests: data.numGuests ? parseInt(data.numGuests) : null,
          extraBedCount: data.extraBedCount ? parseInt(data.extraBedCount) : null,
          totalAmount: parseFloat(data.totalAmount),
          bookingStatus: "STAYED",
          paymentStatus: data.paymentStatus || 'PENDING'
        }
      });

      await tx.room.update({
        where: { roomNumber: roomId },
        data: { currentStatus: 'OCCUPIED_D' }
      });

      return dailyBooking;
    });
  },

  updateDailyBooking: async (id, data) => {
    const currentBooking = await prisma.dailyBooking.findUnique({
      where: { id }
    });

    if (!currentBooking) {
      const error = new Error('Daily booking not found');
      error.status = 404;
      throw error;
    }

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

    return await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.dailyBooking.update({
        where: { id },
        data: updateData
      });

      const roomId = updateData.roomId !== undefined ? updateData.roomId : currentBooking.roomId;

      if (data.bookingStatus === 'CHECKED_OUT') {
        await tx.room.update({
          where: { roomNumber: roomId },
          data: { currentStatus: 'AVAILABLE' }
        });
      } else if (data.bookingStatus === 'STAYED') {
        await tx.room.update({
          where: { roomNumber: roomId },
          data: { currentStatus: 'OCCUPIED_D' }
        });
      } else if (data.roomId !== undefined && data.roomId !== currentBooking.roomId) {
        await tx.room.update({
          where: { roomNumber: parseInt(data.roomId) },
          data: { currentStatus: 'OCCUPIED_D' }
        });
        await tx.room.update({
          where: { roomNumber: currentBooking.roomId },
          data: { currentStatus: 'AVAILABLE' }
        });
      }

      return updatedBooking;
    });
  },

  deleteDailyBooking: async (id) => {
    const booking = await prisma.dailyBooking.findUnique({
      where: { id }
    });

    if (!booking) {
      const error = new Error('Daily booking not found');
      error.status = 404;
      throw error;
    }

    return await prisma.$transaction(async (tx) => {
      await tx.dailyBooking.delete({ where: { id } });

      await tx.room.update({
        where: { roomNumber: booking.roomId },
        data: { currentStatus: 'AVAILABLE' }
      });
    });
  }
};

module.exports = dailyBookingService;
