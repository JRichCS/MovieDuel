const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  movieId: String,
  userId: String,
  username: String,  // Must be included
  text: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
