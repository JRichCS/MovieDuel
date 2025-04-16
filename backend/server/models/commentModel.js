const mongoose = require('mongoose');

// This schema defines the structure of the movie comment data in the database.

const commentSchema = new mongoose.Schema({
  // Movie ID so comments dont show up on other titles
  movieId: String,
  // User ID to pair with usernames and profile pictures
  userId: String,
  // Username to distinguish users
  username: String,  
  // The actual comment data
  text: String,
  // When the comment was posted
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
