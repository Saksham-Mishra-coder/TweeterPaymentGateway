const Tweet = require('../models/tweet');
const User = require('../models/user');
const plans = require('../config/plans');

const createTweet = async (req, res) => {
  try {
    const { userId, content } = req.body;
    
    // In a real application, userId would come from a verified token/middleware
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPlanName = user.plan || 'Free';
    const planDetails = plans[userPlanName];

    if (!planDetails) {
      return res.status(400).json({ error: 'Invalid user plan' });
    }

    // Check tweet limit
    if (user.tweetsPosted >= planDetails.tweets) {
      return res.status(403).json({ error: `Tweet limit reached for ${userPlanName} plan. Upgrade to post more.` });
    }

    const newTweet = new Tweet({
      user: userId,
      content
    });

    await newTweet.save();

    // Increment user tweet count
    user.tweetsPosted += 1;
    await user.save();

    res.status(201).json({ message: 'Tweet created successfully', tweet: newTweet, tweetsPosted: user.tweetsPosted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getTweets = async (req, res) => {
  try {
    const { userId } = req.params;
    const tweets = await Tweet.find({ user: userId }).sort({ createdAt: -1 });
    res.json(tweets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching tweets' });
  }
};

const deleteTweet = async (req, res) => {
  try {
    const { tweetId } = req.params;
    
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    const user = await User.findById(tweet.user);
    if (user && user.tweetsPosted > 0) {
      user.tweetsPosted -= 1;
      await user.save();
    }

    await Tweet.findByIdAndDelete(tweetId);

    res.json({ message: 'Tweet deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting tweet' });
  }
};

module.exports = { createTweet, getTweets, deleteTweet };
