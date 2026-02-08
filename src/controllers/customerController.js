const customerService = require('../services/customerService');

/**
 * Customer Controller
 */

const customerController = {
  getAllCustomers: async (req, res, next) => {
    try {
      const customers = await customerService.getAllCustomers();
      res.json(customers);
    } catch (error) {
      next(error);
    }
  },

  getCustomerById: async (req, res, next) => {
    try {
      const customer = await customerService.getCustomerById(req.customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      next(error);
    }
  },

  createCustomer: async (req, res, next) => {
    try {
      const customer = await customerService.createCustomer(req.body);
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  },

  updateCustomer: async (req, res, next) => {
    try {
      const customer = await customerService.updateCustomer(req.customerId, req.body);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  },

  deleteCustomer: async (req, res, next) => {
    try {
      await customerService.deleteCustomer(req.customerId);
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = customerController;
