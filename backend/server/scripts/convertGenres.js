require("dotenv").config({ path: "../.env" });

const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("../models/movieModel");

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const DB_URL = process.env.DB_URL;

const GENRE_API_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;

// Connect to MongoDB
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Fetch genre ID → name map from TMDB
async function getGenreMap() {
  try {
    const response = await axios.get(GENRE_API_URL);
    const genreMap = {};
    response.data.genres.forEach((genre) => {
      genreMap[genre.id] = genre.name;
    });
    return genreMap;
  } catch (err) {
    console.error("❌ Error fetching genres from TMDB:", err.message);
    return {};
  }
}

// Update movies with genre names
async function updateGenresInMovies() {
  const genreMap = await getGenreMap();
  if (!Object.keys(genreMap).length) {
    console.error("⚠️ No genres fetched. Exiting.");
    process.exit(1);
  }

  const movies = await Movie.find();

  for (const movie of movies) {
    const genreNames = movie.genre_ids.map((id) => genreMap[id]).filter(Boolean);
    movie.genre_names = genreNames;

    try {
      await movie.save();
      console.log(`✅ Updated: ${movie.title}`);
    } catch (err) {
      console.error(`❌ Failed to update ${movie.title}:`, err.message);
    }
  }

  mongoose.disconnect();
  console.log("✅ Genre update complete. Disconnected from DB.");
}

updateGenresInMovies();
