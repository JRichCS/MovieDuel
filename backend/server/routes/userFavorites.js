const express = require("express");
const router = express.Router();
const FavoriteMovies = require("../models/favoriteMoviesModel");

// Route to add a movie to favorites
router.post("/:userId/favorites", async (req, res) => {
    console.log(`POST request received for user ${req.params.userId}`);
    try {
      const { userId } = req.params;
      const { movieId, title } = req.body;
  
      let userFavorites = await FavoriteMovies.findOne({ userId });
  
      if (!userFavorites) {
        userFavorites = new FavoriteMovies({ userId, movies: [] });
      }
  
      // Check if the movie is already in favorites
      if (userFavorites.movies.some((movie) => movie.movieId === movieId)) {
        return res.status(400).json({ message: "Movie already in favorites" });
      }
  
      userFavorites.movies.push({ movieId, title });
      await userFavorites.save();
  
      res.status(200).json({ message: "Movie added to favorites", favorites: userFavorites.movies });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// Remove a movie from favorites
router.delete("/:userId/favorites/:movieId", async (req, res) => {
    try {
      const { userId, movieId } = req.params;
  
      const userFavorites = await FavoriteMovies.findOne({ userId });
      if (!userFavorites) return res.status(404).json({ message: "User not found" });
  
      // Remove the movie using string comparison instead of converting to an integer
      userFavorites.movies = userFavorites.movies.filter(
        (movie) => movie.movieId !== movieId
      );
  
      await userFavorites.save();
  
      res.status(200).json({ message: "Movie removed from favorites", favorites: userFavorites.movies });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Get all favorite movies of a user
router.get("/:userId/favorites", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavorites = await FavoriteMovies.findOne({ userId });
    if (!userFavorites) return res.status(404).json({ message: "No favorites found" });

    res.status(200).json(userFavorites.movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
