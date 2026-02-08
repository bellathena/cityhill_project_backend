const express = require('express');
const paymentController = require('../controllers/paymentController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const validatePaymentId = (req, res, next) => {
  const { id } = req.params;
  const paymentId = parseInt(id, 10);
  if (isNaN(paymentId)) {
    return res.status(400).json({ error: 'Invalid payment ID' });
  }
  req.paymentId = paymentId;
  next();
};

/**
 * Payment Routes
 */

router.get('/', asyncHandler(paymentController.getAllPayments));
router.get('/:id', validatePaymentId, asyncHandler(paymentController.getPaymentById));
router.post('/', asyncHandler(paymentController.createPayment));
router.put('/:id', validatePaymentId, asyncHandler(paymentController.updatePayment));
router.delete('/:id', validatePaymentId, asyncHandler(paymentController.deletePayment));

module.exports = router;
