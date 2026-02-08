const paymentService = require('../services/paymentService');

/**
 * Payment Controller
 */

const paymentController = {
  getAllPayments: async (req, res, next) => {
    try {
      const payments = await paymentService.getAllPayments();
      res.json(payments);
    } catch (error) {
      next(error);
    }
  },

  getPaymentById: async (req, res, next) => {
    try {
      const payment = await paymentService.getPaymentById(req.paymentId);
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.json(payment);
    } catch (error) {
      next(error);
    }
  },

  createPayment: async (req, res, next) => {
    try {
      const payment = await paymentService.createPayment(req.body);
      res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  },

  updatePayment: async (req, res, next) => {
    try {
      const payment = await paymentService.updatePayment(req.paymentId, req.body);
      res.json(payment);
    } catch (error) {
      next(error);
    }
  },

  deletePayment: async (req, res, next) => {
    try {
      await paymentService.deletePayment(req.paymentId);
      res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = paymentController;
