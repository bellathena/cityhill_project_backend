const prisma = require('../utils/prisma');

/**
 * RoomCheck Service - Handle check-in/check-out records
 */

const roomCheckService = {
  getAllRoomChecks: async () => {
    return await prisma.roomCheck.findMany({
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
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  getRoomCheckById: async (id) => {
    return await prisma.roomCheck.findUnique({
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
        }
      }
    });
  },

  getRoomChecksByReference: async (bookingId, contractId) => {
    const where = {};
    if (bookingId) where.dailyBookingId = parseInt(bookingId);
    if (contractId) where.monthlyContractId = parseInt(contractId);

    return await prisma.roomCheck.findMany({
      where,
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
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  createRoomCheck: async (data) => {
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

    return await prisma.roomCheck.create({
      data: {
        dailyBookingId: data.dailyBookingId ? parseInt(data.dailyBookingId) : null,
        monthlyContractId: data.monthlyContractId ? parseInt(data.monthlyContractId) : null,
        checkType: data.checkType, // CHECK_IN or CHECK_OUT
        conditionBed: data.conditionBed || null,
        conditionAir: data.conditionAir || null,
        conditionBathroom: data.conditionBathroom || null,
        conditionLights: data.conditionLights || null,
        notes: data.notes || null,
        evidencePhotos: data.evidencePhotos || null
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
        }
      }
    });
  },

  updateRoomCheck: async (id, data) => {
    // Build update object with only provided fields
    const updateData = {};

    if (data.checkType !== undefined) updateData.checkType = data.checkType;
    if (data.conditionBed !== undefined) updateData.conditionBed = data.conditionBed;
    if (data.conditionAir !== undefined) updateData.conditionAir = data.conditionAir;
    if (data.conditionBathroom !== undefined) updateData.conditionBathroom = data.conditionBathroom;
    if (data.conditionLights !== undefined) updateData.conditionLights = data.conditionLights;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.evidencePhotos !== undefined) updateData.evidencePhotos = data.evidencePhotos;

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }

    return await prisma.roomCheck.update({
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
        }
      }
    });
  },

  deleteRoomCheck: async (id) => {
    return await prisma.roomCheck.delete({
      where: { id }
    });
  }
};

module.exports = roomCheckService;
