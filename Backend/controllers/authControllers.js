const User = require('../models/user');
const sendEmail = require('../services/emailService');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }
    user = new User({ name, email, password }); // Password should be hashed in real map, skipping here for simplicity
    await user.save();
    
    // Optionally send email on registration too:
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Tweeter!',
      html: `<p>Hello ${user.name}, welcome to Tweeter!</p>`
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Send login notification email
  // after user is authenticated

if (user.isFirstLogin) {
  await sendEmail({
    to: user.email,
    subject: "Welcome to Tweeter 🎉",
    html: `
      <p>Hello ${user.name || "User"},</p>
      <p>Welcome to Tweeter! Your account has been successfully created and logged in.</p>
    `
  });

  // ❗ mark as not first login
  user.isFirstLogin = false;
  await user.save();
}
    // Simple basic auth via ID for testing purposes (Not for prod)
    res.json({ message: 'Login successful', userId: user._id, plan: user.plan, name: user.name });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login };
