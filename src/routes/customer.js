const express = require('express');
const customerController = require('../controllers/customerController');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const router = express.Router();

const validateCustomerId = (req, res, next) => {
  const { id } = req.params;
  const customerId = parseInt(id, 10);
  if (isNaN(customerId)) {
    return res.status(400).json({ error: 'Invalid customer ID' });
  }
  req.customerId = customerId;
  next();
};

/**
 * Customer Routes
 */

router.get('/',asyncHandler(customerController.getAllCustomers));
router.get('/:id', validateCustomerId, asyncHandler(customerController.getCustomerById));
router.post('/', asyncHandler(customerController.createCustomer));
router.put('/:id', validateCustomerId, asyncHandler(customerController.updateCustomer));
router.delete('/:id', validateCustomerId, asyncHandler(customerController.deleteCustomer));

module.exports = router;
