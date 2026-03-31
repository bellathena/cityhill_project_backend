const roomService = require('../services/roomService');

const roomController = {
  getAllRooms: async (req, res, next) => {
    try {
      const rooms = await roomService.getAllRooms();
      res.json(rooms);
    } catch (error) {
      next(error);
    }
  },

  getRoomById: async (req, res, next) => {
    try {
      const room = await roomService.getRoomById(req.roomId);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.json(room);
    } catch (error) {
      next(error);
    }
  },

  createRoom: async (req, res, next) => {
    try {
      const room = await roomService.createRoom(req.body);
      res.status(201).json(room);
    } catch (error) {
      next(error);
    }
  },

  updateRoom: async (req, res, next) => {
    try {
      const room = await roomService.updateRoom(req.roomId, req.body);
      res.json(room);
    } catch (error) {
      next(error);
    }
  },

  deleteRoom: async (req, res, next) => {
    try {
      await roomService.deleteRoom(req.roomId);
      res.json({ message: 'Room deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = roomController;
