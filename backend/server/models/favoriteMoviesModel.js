const mongoose = require("mongoose");

const favoriteMoviesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Ensure consistency
      ref: "users",
      required: true,
    },
    movies: [
      {
        movieId: {
          type: String, // Ensure this matches the request payload
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

module.exports = mongoose.model("FavoriteMovies", favoriteMoviesSchema);
