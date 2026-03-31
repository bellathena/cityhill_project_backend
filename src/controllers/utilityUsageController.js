const utilityUsageService = require('../services/utilityUsageService');

const utilityUsageController = {
  getAllUsages: async (req, res, next) => {
    try {
      const usages = await utilityUsageService.getAllUsages();
      res.json(usages);
    } catch (error) {
      next(error);
    }
  },

  getUsageById: async (req, res, next) => {
    try {
      const usage = await utilityUsageService.getUsageById(req.usageId);
      if (!usage) {
        return res.status(404).json({ error: 'Utility usage not found' });
      }
      res.json(usage);
    } catch (error) {
      next(error);
    }
  },

  getUsagesByRoom: async (req, res, next) => {
    try {
      const { roomId } = req.params;
      const usages = await utilityUsageService.getUsagesByRoom(roomId);
      res.json(usages);
    } catch (error) {
      next(error);
    }
  },

  createUsage: async (req, res, next) => {
    try {
      const usage = await utilityUsageService.createUsage(req.body);
      res.status(201).json(usage);
    } catch (error) {
      next(error);
    }
  },

  updateUsage: async (req, res, next) => {
    try {
      const usage = await utilityUsageService.updateUsage(req.usageId, req.body);
      res.json(usage);
    } catch (error) {
      next(error);
    }
  },

  deleteUsage: async (req, res, next) => {
    try {
      await utilityUsageService.deleteUsage(req.usageId);
      res.json({ message: 'Utility usage deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = utilityUsageController;
