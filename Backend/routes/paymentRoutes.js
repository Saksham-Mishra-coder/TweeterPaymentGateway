const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const timeCheck = require('../middleware/timeCheck');

const router = express.Router();

router.post('/create-order', timeCheck, createOrder);
router.post('/verify-payment', verifyPayment);
module.exports = router;
