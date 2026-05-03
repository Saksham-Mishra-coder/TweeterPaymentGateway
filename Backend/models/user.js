const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: {
    type: String,
    enum: ['Free', 'Bronze', 'Silver', 'Gold'],
    default: 'Free',
    required: true
  },
  tweetsPosted: {
    type: Number,
    default: 0
  },
  isFirstLogin: {
  type: Boolean,
  default: true
}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
