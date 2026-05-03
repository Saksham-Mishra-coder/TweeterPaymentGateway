const express = require('express');
const { createTweet, getTweets, deleteTweet } = require('../controllers/tweetController');

const router = express.Router();

router.post('/', createTweet);
router.get('/:userId', getTweets);
router.delete('/:tweetId', deleteTweet);

module.exports = router;
