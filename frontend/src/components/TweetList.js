import React, { useState, useEffect } from 'react';
import { getTweets, deleteTweet } from '../services/tweetService.js';

const TweetList = ({ user, refreshKey }) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    if (user && user.userId) {
      getTweets(user.userId)
        .then(res => setTweets(res.data))
        .catch(err => console.error('Failed to fetch tweets', err));
    }
  }, [user, refreshKey]);

  const handleDelete = async (tweetId) => {
    try {
      await deleteTweet(tweetId);
      setTweets(tweets.filter(t => t._id !== tweetId));
    } catch (err) {
      console.error('Failed to delete tweet', err);
      alert('Failed to delete tweet');
    }
  };

  return (
    <div className="tweet-list-container">
      <h2 style={{ marginBottom: '16px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Your Tweets</h2>
      {tweets.length === 0 ? (
        <div className="glass-panel text-center text-muted">
          No tweets to display yet.
        </div>
      ) : (
        <div className="tweet-list">
          {tweets.map(tweet => (
            <div key={tweet._id} className="glass-panel tweet-card">
              <p className="tweet-content">{tweet.content}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="tweet-meta">
                  {new Date(tweet.createdAt).toLocaleString()}
                </div>
                <button 
                  onClick={() => handleDelete(tweet._id)}
                  className="btn btn-primary" 
                  style={{ backgroundColor: 'var(--danger)', backgroundImage: 'none', padding: '4px 12px', fontSize: '0.85rem', width: 'auto', boxShadow: 'none' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TweetList;
