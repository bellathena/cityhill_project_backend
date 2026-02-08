const invoiceService = require('../services/invoiceService');

/**
 * Invoice Controller
 */

const invoiceController = {
  getAllInvoices: async (req, res, next) => {
    try {
      const invoices = await invoiceService.getAllInvoices();
      res.json(invoices);
    } catch (error) {
      next(error);
    }
  },

  getInvoiceById: async (req, res, next) => {
    try {
      const invoice = await invoiceService.getInvoiceById(req.invoiceId);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  },

  createInvoice: async (req, res, next) => {
    try {
      const invoice = await invoiceService.createInvoice(req.body);
      res.status(201).json(invoice);
    } catch (error) {
      next(error);
    }
  },

  updateInvoice: async (req, res, next) => {
    try {
      const invoice = await invoiceService.updateInvoice(req.invoiceId, req.body);
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  },

  deleteInvoice: async (req, res, next) => {
    try {
      await invoiceService.deleteInvoice(req.invoiceId);
      res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = invoiceController;
