const express = require("express");
const Movie = require("../models/movieModel");

const router = express.Router();

// Route 1: Create or update a movie by IMDb ID
router.post("/movies", async (req, res) => {
  const {
    imdbID,
    title,
    original_title,
    overview,
    release_date,
    vote_average,
    vote_count,
    popularity,
    poster_path,
    backdrop_path,
    genre_ids,
    genre_names,
    original_language,
    actors,
    IMDBRating,
    Top250Ranking,
  } = req.body;

  try {
    const existingMovie = await Movie.findOne({ imdbID });
    if (existingMovie) {
      return res.status(400).json({ message: "Movie with this IMDb ID already exists" });
    }

    const movie = new Movie({
      imdbID,
      title,
      original_title,
      overview,
      release_date,
      vote_average,
      vote_count,
      popularity,
      poster_path,
      backdrop_path,
      genre_ids,
      genre_names,
      original_language,
      actors,
      IMDBRating,
      Top250Ranking,
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    console.error("Error creating movie:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route 2: Get all movies
router.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route 3: Get a movie by IMDb ID

// maybe update this to get a movie by ranking, or add a new route for that

router.get("/movies/:imdbID", async (req, res) => {
  const { imdbID } = req.params;

  try {
    const movie = await Movie.findOne({ imdbID });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route 4: Update a movie by IMDb ID
router.put("/movies/:imdbID", async (req, res) => {
  const { imdbID } = req.params;
  const {
    title,
    original_title,
    overview,
    release_date,
    vote_average,
    vote_count,
    popularity,
    poster_path,
    backdrop_path,
    genre_ids,
    genre_names,
    original_language,
    actors,
    IMDBRating,
    Top250Ranking,
  } = req.body;

  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { imdbID },
      {
        $set: {
          title,
          original_title,
          overview,
          release_date,
          vote_average,
          vote_count,
          popularity,
          poster_path,
          backdrop_path,
          genre_ids,
          genre_names,
          original_language,
          actors,
          IMDBRating,
          Top250Ranking,
        },
      },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route 5: Get random movies
router.get("/randomMovies", async (req, res) => {
  try {
    const movies = await Movie.aggregate([{ $sample: { size: 2 } }]);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching random movies" });
  }
});

// Route 6: Get a random movie, and another movie within 10 range higher or lower than the first one
router.get("/randomMoviesWithRange", async (req, res) => {
  try {
    // Get a random movie from the database
    const randomMovie = await Movie.aggregate([{ $sample: { size: 1 } }]);

    if (!randomMovie || randomMovie.length === 0) {
      return res.status(404).json({ message: "No random movie found." });
    }

    const movie = randomMovie[0];
    const originalRanking = movie.Top250Ranking;

    // Calculate the range for the random movie selection
    const minRank = Math.max(originalRanking - 10, 1);
    const maxRank = originalRanking + 10;

    // Get another random movie within the rank range and not the same movie
    const movieInRange = await Movie.aggregate([
      { 
        $match: { 
          Top250Ranking: { $gte: minRank, $lte: maxRank },
          _id: { $ne: movie._id } // ensure it doesn't return the same movie
        }
      },
      { $sample: { size: 1 } },
    ]);

    if (!movieInRange || movieInRange.length === 0) {
      return res.status(404).json({ message: "No movie found within rank range." });
    }

    const randomMovieInRange = movieInRange[0];

    // Return both movies as an array (same format as /randomMovies)
    res.json([movie, randomMovieInRange]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching random movies within range" });
  }
});


// Route 7: Delete a movie by IMDb ID
router.delete("/movies/:imdbID", async (req, res) => {
  const { imdbID } = req.params;

  try {
    const deletedMovie = await Movie.findOneAndDelete({ imdbID });
    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
