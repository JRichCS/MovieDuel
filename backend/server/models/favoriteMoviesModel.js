const mongoose = require("mongoose");

// This schema defines the structure of the favorite movie list in the database
const favoriteMoviesSchema = new mongoose.Schema(
  {
    // User ID to distinguish between users
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    // An array of favorited movies
    movies: [
      {
        // Movie ID
        movieId: {
          type: String, // Ensure this matches the request payload
          required: true,
        },
        // Movie Title
        title: {
          type: String,
          required: true,
        },
        // When it was added to favorites
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  // Add to own collection
  { collection: "favoriteMovies" }
);

module.exports = mongoose.model("FavoriteMovies", favoriteMoviesSchema);
