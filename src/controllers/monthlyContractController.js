const monthlyContractService = require('../services/monthlyContractService');

/**
 * MonthlyContract Controller
 */

const monthlyContractController = {
  getAllMonthlyContracts: async (req, res, next) => {
    try {
      const contracts = await monthlyContractService.getAllMonthlyContracts();
      res.json(contracts);
    } catch (error) {
      next(error);
    }
  },

  getMonthlyContractById: async (req, res, next) => {
    try {
      const contract = await monthlyContractService.getMonthlyContractById(req.contractId);
      if (!contract) {
        return res.status(404).json({ error: 'Monthly contract not found' });
      }
      res.json(contract);
    } catch (error) {
      next(error);
    }
  },

  createMonthlyContract: async (req, res, next) => {
    try {
      const contract = await monthlyContractService.createMonthlyContract(req.body);
      res.status(201).json(contract);
    } catch (error) {
      next(error);
    }
  },

  updateMonthlyContract: async (req, res, next) => {
    try {
      const contract = await monthlyContractService.updateMonthlyContract(req.contractId, req.body);
      res.json(contract);
    } catch (error) {
      next(error);
    }
  },

  deleteMonthlyContract: async (req, res, next) => {
    try {
      await monthlyContractService.deleteMonthlyContract(req.contractId);
      res.json({ message: 'Monthly contract deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = monthlyContractController;
