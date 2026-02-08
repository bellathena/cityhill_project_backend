const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const validateInvoiceId = (req, res, next) => {
  const { id } = req.params;
  const invoiceId = parseInt(id, 10);
  if (isNaN(invoiceId)) {
    return res.status(400).json({ error: 'Invalid invoice ID' });
  }
  req.invoiceId = invoiceId;
  next();
};

/**
 * Invoice Routes
 */

router.get('/', asyncHandler(invoiceController.getAllInvoices));
router.get('/:id', validateInvoiceId, asyncHandler(invoiceController.getInvoiceById));
router.post('/', asyncHandler(invoiceController.createInvoice));
router.put('/:id', validateInvoiceId, asyncHandler(invoiceController.updateInvoice));
router.delete('/:id', validateInvoiceId, asyncHandler(invoiceController.deleteInvoice));

module.exports = router;
