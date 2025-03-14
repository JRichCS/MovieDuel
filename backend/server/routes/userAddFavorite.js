const express = require("express");
const router = express.Router();
const favoriteMoviesModel = require("../models/favoriteMoviesModel");

// Route to add a favorite movie
router.post("/like", async (req, res) => {
  const { userId, movieId, title } = req.body;

  // Find the user's favorite movies list
  let favoriteMovies = await favoriteMoviesModel.findOne({ userId });

  // If the user doesn't have a favorites list, create one
  if (!favoriteMovies) {
    favoriteMovies = new favoriteMoviesModel({
      userId,
      movies: [{ movieId, title }],
    });
  } else {
    // Add the movie to the existing favorites list
    favoriteMovies.movies.push({ movieId, title });
  }

  // Save the updated favorite movies list
  await favoriteMovies.save();

  // Respond with a success message
  res.status(200).json({ message: "Movie added to favorites successfully.", favoriteMovies });
});

module.exports = router;