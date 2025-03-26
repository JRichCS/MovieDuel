const mongoose = require("mongoose");

// Comment Model Schema

// Requires
// ----
// Username
// Movie ID
// User ID
// Comment text
// Time of comment

    const commentSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
      movieId: { type: String, required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    });
    
    module.exports = mongoose.model('Comment', commentSchema);
    
