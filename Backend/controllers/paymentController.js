const razorpayInstance = require('../config/razorpay');
const crypto = require('crypto');
const Subscription = require('../models/subscription');
const User = require('../models/user');
const plans = require('../config/plans');
const sendEmail = require('../services/emailService');

const createOrder = async (req, res) => {
  try {
    const { userId, planName } = req.body;
    
    if (!plans[planName] || planName === 'Free') {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const amount = plans[planName].price * 100; // Razorpay expects amount in paise

    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);

    const subscription = new Subscription({
      user: userId,
      plan: planName,
      amount: plans[planName].price,
      razorpayOrderId: order.id
    });
    await subscription.save();

    res.json({ success: true, order, subscriptionId: subscription._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create order' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, subscriptionId } = req.body;

    const subscription = await Subscription.findById(subscriptionId).populate('user');
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto.createHmac('sha256', secret)
                                    .update(body.toString())
                                    .digest('hex');

    if (expectedSignature === razorpaySignature) {
      subscription.razorpayPaymentId = razorpayPaymentId;
      subscription.razorpaySignature = razorpaySignature;
      subscription.status = 'completed';
      await subscription.save();

      // Update user plan
      const user = subscription.user;
      user.plan = subscription.plan;
      user.tweetsPosted = 0; // Reset tweets count for the new plan
      await user.save();

      // Send Invoice Email
      const emailContent = `
        <h3>Invoice Details</h3>
        <p>Dear ${user.name},</p>
        <p>Thank you for subscribing to the ${subscription.plan} plan.</p>
        <p>Amount Paid: ₹${subscription.amount}</p>
        <p>Order ID: ${razorpayOrderId}</p>
        <p>Payment ID: ${razorpayPaymentId}</p>
        <br>
        <p>Enjoy your renewed limits!</p>
      `;
      
      await sendEmail({
        to: user.email,
        subject: `Payment Successful - Invoice for ${subscription.plan} Plan`,
        html: emailContent
      });

      res.json({ success: true, message: 'Payment verified and plan updated successfully' });
    } else {
      subscription.status = 'failed';
      await subscription.save();
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { createOrder, verifyPayment };
