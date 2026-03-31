const utilitiesService = require('../services/utilitiesService');

const utilitiesController = {
  getAllUtilities: async (req, res, next) => {
    try {
      const utilities = await utilitiesService.getAllUtilities();
      res.json(utilities);
    } catch (error) {
      next(error);
    }
  },

  getUtilityById: async (req, res, next) => {
    try {
      const utility = await utilitiesService.getUtilityById(req.utilityId);
      if (!utility) {
        return res.status(404).json({ error: 'Utility not found' });
      }
      res.json(utility);
    } catch (error) {
      next(error);
    }
  },

  createUtility: async (req, res, next) => {
    try {
      const utility = await utilitiesService.createUtility(req.body);
      res.status(201).json(utility);
    } catch (error) {
      next(error);
    }
  },

  updateUtility: async (req, res, next) => {
    try {
      const utility = await utilitiesService.updateUtility(req.utilityId, req.body);
      res.json(utility);
    } catch (error) {
      next(error);
    }
  },

  deleteUtility: async (req, res, next) => {
    try {
      await utilitiesService.deleteUtility(req.utilityId);
      res.json({ message: 'Utility deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = utilitiesController;
