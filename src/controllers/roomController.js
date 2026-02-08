const roomService = require('../services/roomService');

/**
 * Room Controller - Handles request/response for room endpoints
 */

const roomController = {
  /**
   * GET /api/rooms - Get all rooms
   */
  getAllRooms: async (req, res, next) => {
    try {
      const rooms = await roomService.getAllRooms();
      res.json(rooms);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/rooms/:id - Get room by ID
   */
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

  /**
   * POST /api/rooms - Create new room
   */
  createRoom: async (req, res, next) => {
    try {
      const room = await roomService.createRoom(req.body);
      res.status(201).json(room);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/rooms/:id - Update room
   */
  updateRoom: async (req, res, next) => {
    try {
      const room = await roomService.updateRoom(req.roomId, req.body);
      res.json(room);
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/rooms/:id - Delete room
   */
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
