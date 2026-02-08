const roomTypeService = require('../services/roomTypeService');

/**
 * RoomType Controller
 */

const roomTypeController = {
  getAllRoomTypes: async (req, res, next) => {
    try {
      const roomTypes = await roomTypeService.getAllRoomTypes();
      res.json(roomTypes);
    } catch (error) {
      next(error);
    }
  },

  getRoomTypeById: async (req, res, next) => {
    try {
      const roomType = await roomTypeService.getRoomTypeById(req.roomTypeId);
      if (!roomType) {
        return res.status(404).json({ error: 'Room type not found' });
      }
      res.json(roomType);
    } catch (error) {
      next(error);
    }
  },

  createRoomType: async (req, res, next) => {
    try {
      const roomType = await roomTypeService.createRoomType(req.body);
      res.status(201).json(roomType);
    } catch (error) {
      next(error);
    }
  },

  updateRoomType: async (req, res, next) => {
    try {
      const roomType = await roomTypeService.updateRoomType(req.roomTypeId, req.body);
      res.json(roomType);
    } catch (error) {
      next(error);
    }
  },

  deleteRoomType: async (req, res, next) => {
    try {
      await roomTypeService.deleteRoomType(req.roomTypeId);
      res.json({ message: 'Room type deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = roomTypeController;
