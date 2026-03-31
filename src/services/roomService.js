const prisma = require('../utils/prisma');

const roomService = {
  getAllRooms: async () => {
    return await prisma.room.findMany({
      orderBy: { roomNumber: 'asc' },
      include: {
        roomType: true,
        dailyBookings: {
          include: { customer: true }
        },
        monthlyContracts: {
          where: { contractStatus: 'ACTIVE' },
          include: {
            customer: true,
            invoices: true
          }
        },
        utilityUsages: true
      }
    });
  },

  getRoomById: async (roomNumber) => {
    return await prisma.room.findUnique({
      where: { roomNumber },
      include: {
        roomType: true,
        dailyBookings: {
          include: { customer: true }
        },
        monthlyContracts: {
          include: {
            customer: true,
            invoices: true,
            moveOutSettlement: true
          }
        },
        utilityUsages: {
          include: { utilityType: true }
        }
      }
    });
  },

  createRoom: async (data) => {
    try {
      return await prisma.room.create({
        data: {
          roomNumber: parseInt(data.roomNumber),
          floor: parseFloat(data.floor),
          typeId: parseInt(data.typeId),
          allowedType: data.allowedType || 'FLEXIBLE',
          currentStatus: data.currentStatus || 'AVAILABLE'
        }
      });
    } catch (err) {
      if (err.code === 'P2002') {
        const error = new Error('ห้องนี้มีอยู่แล้ว');
        error.status = 400;
        throw error;
      }

      throw err;
    }
  },

  updateRoom: async (roomNumber, data) => {
    const updateData = {};

    if (data.floor !== undefined) updateData.floor = parseFloat(data.floor);
    if (data.typeId !== undefined) updateData.typeId = parseInt(data.typeId);
    if (data.allowedType !== undefined) updateData.allowedType = data.allowedType;
    if (data.currentStatus !== undefined) updateData.currentStatus = data.currentStatus;
    if (data.latestMeterElectric !== undefined) updateData.latestMeterElectric = parseInt(data.latestMeterElectric);
    if (data.latestMeterWater !== undefined) updateData.latestMeterWater = parseInt(data.latestMeterWater);

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.room.update({
      where: { roomNumber },
      data: updateData
    });
  },

  deleteRoom: async (roomNumber) => {
    const activeDailyBookings = await prisma.dailyBooking.findMany({
      where: { roomId: roomNumber, bookingStatus: 'STAYED' }
    });

    const activeContracts = await prisma.monthlyContract.findMany({
      where: { roomId: roomNumber, contractStatus: 'ACTIVE' }
    });

    if (activeDailyBookings.length > 0 || activeContracts.length > 0) {
      const error = new Error('Cannot delete room with active bookings or contracts');
      error.status = 400;
      throw error;
    }

    return await prisma.room.delete({
      where: { roomNumber }
    });
  }
};

module.exports = roomService;
