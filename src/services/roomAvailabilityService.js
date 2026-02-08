const prisma = require('../utils/prisma');

/**
 * RoomAvailability Service (Calendar Status)
 */

const roomAvailabilityService = {
  // Get all availability records
  getAllAvailability: async () => {
    return await prisma.roomAvailability.findMany({
      include: {
        room: {
          include: {
            roomType: true
          }
        }
      },
      orderBy: [
        { roomId: 'asc' },
        { checkDate: 'asc' }
      ]
    });
  },

  // Get availability by room and date range
  getAvailabilityByRoomAndDateRange: async (roomId, startDate, endDate) => {
    return await prisma.roomAvailability.findMany({
      where: {
        roomId: parseInt(roomId),
        checkDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        room: {
          include: {
            roomType: true
          }
        }
      },
      orderBy: { checkDate: 'asc' }
    });
  },

  // Get calendar view for all rooms in a month
  getMonthCalendar: async (year, month) => {
    const startDate = new Date(year, month - 1, 1); // First day of month
    const endDate = new Date(year, month, 0); // Last day of month

    const availability = await prisma.roomAvailability.findMany({
      where: {
        checkDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        room: {
          include: {
            roomType: true
          }
        }
      },
      orderBy: [
        { roomId: 'asc' },
        { checkDate: 'asc' }
      ]
    });

    // Format data into calendar structure
    const rooms = {};
    availability.forEach(record => {
      if (!rooms[record.roomId]) {
        rooms[record.roomId] = {
          roomId: record.roomId,
          roomNumber: record.room.roomNumber,
          roomType: record.room.roomType.typeName,
          days: {}
        };
      }
      rooms[record.roomId].days[record.checkDate.getDate()] = {
        status: record.status,
        referenceId: record.referenceId,
        refType: record.refType
      };
    });

    return Object.values(rooms);
  },

  // Get availability by room and month
  getRoomMonthAvailability: async (roomId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return await prisma.roomAvailability.findMany({
      where: {
        roomId: parseInt(roomId),
        checkDate: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { checkDate: 'asc' }
    });
  },

  // Get availability for specific date (all rooms)
  getAvailabilityByDate: async (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return await prisma.roomAvailability.findMany({
      where: {
        checkDate: targetDate
      },
      include: {
        room: {
          include: {
            roomType: true
          }
        }
      }
    });
  },

  // Get room status summary
  getRoomStatusSummary: async (startDate, endDate) => {
    const availability = await prisma.roomAvailability.findMany({
      where: {
        checkDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        room: true
      }
    });

    // Count statuses by room
    const summary = {};
    availability.forEach(record => {
      if (!summary[record.roomId]) {
        summary[record.roomId] = {
          roomNumber: record.room.roomNumber,
          available: 0,
          booked: 0,
          occupied: 0
        };
      }
      if (record.status === 'AVAILABLE') summary[record.roomId].available++;
      else if (record.status === 'BOOKED') summary[record.roomId].booked++;
      else if (record.status === 'OCCUPIED') summary[record.roomId].occupied++;
    });

    return Object.values(summary);
  }
};

module.exports = roomAvailabilityService;
