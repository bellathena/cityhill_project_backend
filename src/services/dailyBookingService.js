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
    const roomId = parseInt(data.roomId);
    const checkInDate = new Date(data.checkInDate);
    const checkOutDate = new Date(data.checkOutDate);

    // Use transaction to create both DailyBooking and RoomAvailability records
    const booking = await prisma.$transaction(async (tx) => {
      // Create DailyBooking
      const dailyBooking = await tx.dailyBooking.create({
        data: {
          customerId: parseInt(data.customerId),
          roomId: roomId,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          numGuests: data.numGuests ? parseInt(data.numGuests) : null,
          extraBedCount: data.extraBedCount ? parseInt(data.extraBedCount) : null,
          totalAmount: parseFloat(data.totalAmount),
          bookingStatus: data.bookingStatus || 'CONFIRMED',
          paymentStatus: data.paymentStatus || 'PENDING'
        }
      });

      // Create RoomAvailability records for each day in the booking period
      const currentDate = new Date(checkInDate);
      const availabilityRecords = [];
      
      while (currentDate < checkOutDate) {
        availabilityRecords.push({
          roomId: roomId,
          checkDate: new Date(currentDate),
          referenceId: dailyBooking.id,
          refType: 'Daily',
          status: 'BOOKED'
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Upsert availability records (create or update if exists)
      for (const record of availabilityRecords) {
        await tx.roomAvailability.upsert({
          where: {
            roomId_checkDate: {
              roomId: record.roomId,
              checkDate: record.checkDate
            }
          },
          create: record,
          update: {
            referenceId: record.referenceId,
            refType: record.refType,
            status: record.status
          }
        });
      }

      return dailyBooking;
    });

    return booking;
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
    
    const booking = await prisma.dailyBooking.findUnique({
      where: { id }
    });

    if (!booking) {
      const error = new Error('Daily booking not found');
      error.status = 404;
      throw error;
    }

    // Use transaction to delete booking and update RoomAvailability
    return await prisma.$transaction(async (tx) => {
      // Delete the DailyBooking
      await tx.dailyBooking.delete({
        where: { id }
      });

      // Delete RoomAvailability records for this booking
      await tx.roomAvailability.deleteMany({
        where: {
          referenceId: id,
          refType: 'Daily'
        }
      });
    });
  }
};

module.exports = dailyBookingService;
