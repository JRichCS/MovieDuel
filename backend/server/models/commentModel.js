const mongoose = require("mongoose");

// Comment Model Schema
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ensure this matches your User model
      required: true,
    },
    movie: {
      movieId: {
        type: Number, // Change to ObjectId if movies are in a separate collection
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "movieComments" }
);

module.exports = mongoose.model("Comment", commentSchema, "movieComments");
