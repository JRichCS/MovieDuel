const mongoose = require("mongoose");

// Favorite Movies Schema
const favoriteMoviesSchema = new mongoose.Schema(
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
  },
  { collection: "favoriteMovies" }
);

module.exports = mongoose.model("favoriteMovies", favoriteMoviesSchema);
