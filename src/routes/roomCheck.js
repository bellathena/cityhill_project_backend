const express = require('express');
const router = express.Router();
const roomCheckController = require('../controllers/roomCheckController');

/**
 * RoomCheck Routes - Check-in/Check-out records
 */

// GET all room checks
router.get('/', roomCheckController.getAllRoomChecks);

// GET room checks by daily booking ID
router.get('/booking/:bookingId', roomCheckController.getRoomChecksByBooking);

// GET room checks by monthly contract ID
router.get('/contract/:contractId', roomCheckController.getRoomChecksByContract);

// GET room check by ID
router.get('/:id', roomCheckController.getRoomCheckById);

// POST create room check
router.post('/', roomCheckController.createRoomCheck);

// PUT update room check
router.put('/:id', roomCheckController.updateRoomCheck);

// DELETE room check
router.delete('/:id', roomCheckController.deleteRoomCheck);

module.exports = router;
