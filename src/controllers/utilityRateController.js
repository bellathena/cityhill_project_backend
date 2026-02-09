const utilityRateService = require('../services/utilityRateService');

/**
 * UtilityRate Controller
 */

const utilityRateController = {
  getAllUtilityRates: async (req, res, next) => {
    try {
      const utilityRates = await utilityRateService.getAllUtilityRates();
      res.json(utilityRates);
    } catch (error) {
      next(error);
    }
  },

  getUtilityRateById: async (req, res, next) => {
    try {
      const utilityRate = await utilityRateService.getUtilityRateById(req.utilityRateId);
      if (!utilityRate) {
        return res.status(404).json({ error: 'Utility rate not found' });
      }
      res.json(utilityRate);
    } catch (error) {
      next(error);
    }
  },

  getLatestUtilityRate: async (req, res, next) => {
    try {
      const utilityRate = await utilityRateService.getLatestUtilityRate();
      if (!utilityRate) {
        return res.status(404).json({ error: 'No utility rates found' });
      }
      res.json(utilityRate);
    } catch (error) {
      next(error);
    }
  },

  createUtilityRate: async (req, res, next) => {
    try {
      const utilityRate = await utilityRateService.createUtilityRate(req.body);
      res.status(201).json(utilityRate);
    } catch (error) {
      next(error);
    }
  },

  updateUtilityRate: async (req, res, next) => {
    try {
      const utilityRate = await utilityRateService.updateUtilityRate(req.utilityRateId, req.body);
      res.json(utilityRate);
    } catch (error) {
      next(error);
    }
  },

  deleteUtilityRate: async (req, res, next) => {
    try {
      await utilityRateService.deleteUtilityRate(req.utilityRateId);
      res.json({ message: 'Utility rate deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = utilityRateController;
