const prisma = require('../utils/prisma');

/**
 * Room Service - Contains all room business logic
 */

const roomService = {
  /**
   * Get all rooms with active bookings/contracts
   */
  getAllRooms: async () => {
    return await prisma.room.findMany({
      orderBy: { roomNumber: 'asc' },
      include: {
        roomType: true,
        dailyBookings: {
          include: {
            customer: true,
            invoices: true
          }
        },
        monthlyContracts: {
          where: {
            contractStatus: 'ACTIVE'
          },
          include: {
            customer: true,
            invoices: true
          }
        }
      }
    });
  },

  /**
   * Get a specific room by ID
   */
  getRoomById: async (id) => {
    return await prisma.room.findUnique({
      where: { id },
      include: {
        roomType: true,
        dailyBookings: {
          include: {
            customer: true,
            invoices: true,
            checks_daily: true
          }
        },
        monthlyContracts: {
          include: {
            customer: true,
            invoices: true,
            checks_contract: true
          }
        },
        meterReadings: true
      }
    });
  },

  /**
   * Create a new room
   */
  createRoom: async (data) => {
    return await prisma.room.create({
      data: {
        roomNumber: data.roomNumber,
        floor: parseFloat(data.floor),
        typeId: parseInt(data.typeId),
        allowedType: data.allowedType || 'FLEXIBLE',
        currentStatus: data.currentStatus || 'AVAILABLE'
      }
    });
  },

  /**
   * Update a room
   */
  updateRoom: async (id, data) => {
    // Build update object with only provided fields
    const updateData = {};
    
    if (data.roomNumber !== undefined) updateData.roomNumber = data.roomNumber;
    if (data.floor !== undefined) updateData.floor = parseFloat(data.floor);
    if (data.typeId !== undefined) updateData.typeId = parseInt(data.typeId);
    if (data.allowedType !== undefined) updateData.allowedType = data.allowedType;
    if (data.currentStatus !== undefined) updateData.currentStatus = data.currentStatus;

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.room.update({
      where: { id },
      data: updateData
    });
  },

  /**
   * Delete a room (only if no active bookings/contracts)
   */
  deleteRoom: async (id) => {
    // Check for active daily bookings
    const activeDailyBookings = await prisma.dailyBooking.findMany({
      where: {
        roomId: id,
        bookingStatus: 'CONFIRMED'
      }
    });

    // Check for active monthly contracts
    const activeContracts = await prisma.monthlyContract.findMany({
      where: {
        roomId: id,
        contractStatus: 'ACTIVE'
      }
    });

    if (activeDailyBookings.length > 0 || activeContracts.length > 0) {
      const error = new Error('Cannot delete room with active bookings or contracts');
      error.status = 400;
      throw error;
    }

    return await prisma.room.delete({
      where: { id }
    });
  }
};

module.exports = roomService;
