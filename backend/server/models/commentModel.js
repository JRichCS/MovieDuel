const mongoose = require("mongoose");

// Comment Model Schema
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    movies: [
      {
        movieId: {
          type: Number, // Change this if using ObjectId for movies
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comment: {
        type: String,
        required: true,

    }
  },
  { collection: "movieComments" }
);

module.exports = mongoose.model("movieComments", commentSchema);
