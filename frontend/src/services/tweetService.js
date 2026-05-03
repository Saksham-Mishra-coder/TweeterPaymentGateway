import api from './api.js';

export const getTweets = async (userId) => {
  return await api.get(`/tweet/${userId}`);
};

export const createTweet = async (tweetData) => {
  return await api.post('/tweet', tweetData);
};

export const deleteTweet = async (tweetId) => {
  return await api.delete(`/tweet/${tweetId}`);
};
