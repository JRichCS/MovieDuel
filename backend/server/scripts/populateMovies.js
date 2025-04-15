require('dotenv').config({ path: '../.env' }); // Adjust path if .env is outside the scripts folder

const axios = require('axios');
const mongoose = require('mongoose');
const Movie = require('../models/movieModel.js'); // Adjust the path as necessary

const TMDB_API_KEY = "###"; //.env is broken since this file is in the scripts folder lol
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DB_URL = process.env.DB_URL;  // MongoDB URL from .env

if (!DB_URL) {
  console.error('MongoDB connection URL is not defined in the .env file');
  process.exit(1); // Exit if no DB_URL is found
}

const TOTAL_MOVIES = 250;
const MOVIES_PER_PAGE = 20;
const TOTAL_PAGES = Math.ceil(TOTAL_MOVIES / MOVIES_PER_PAGE);

async function fetchMovieDetails(tmdbMovieId) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbMovieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits',
      },
      
    });
   // console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for TMDB ID ${tmdbMovieId}:`, error.message);
    return null;
  }
}

async function fetchTopMovies() {
  const movies = [];

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          sort_by: 'vote_count.desc',
          vote_count_gte: 1000,
          page,
        },
      });

      movies.push(...response.data.results);
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error.message);
    }
  }

  return movies.slice(0, TOTAL_MOVIES);
}

async function saveMoviesToDB(movies) {
  for (const movie of movies) {
    try {
      // Get IMDb ID by fetching movie details
      const movieDetails = await fetchMovieDetails(movie.id);
      if (!movieDetails) {
        console.error(`Skipping movie ${movie.title} due to missing details`);
        continue;
      }

      //console.log(movieDetails.credits.cast);
      const movieData = {
        imdbID: movieDetails.imdb_id || 'N/A',  // Use TMDB API to get IMDb ID
        title: movie.title,
        original_title: movie.original_title || 'N/A',
        overview: movie.overview || 'N/A',
        release_date: movie.release_date || 'N/A',
        vote_average: movie.vote_average || 0,
        vote_count: movie.vote_count || 0,
        popularity: movie.popularity || 0,
        poster_path: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '',
        backdrop_path: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
          : '',
        genre_ids: movie.genre_ids || [],
        original_language: movie.original_language || 'N/A',
        actors: movieDetails.credits?.cast
    ? movieDetails.credits.cast
        .sort((a, b) => a.order - b.order)
        .slice(0, 3)
        .map(actor => actor.name)
    : [],

      };
      await Movie.updateOne(
        { imdbID: movieData.imdbID },
        { $set: movieData },
        { upsert: true }
      );

      console.log(movieData);

    } catch (error) {
      console.error(`Error saving movie ${movie.title}:`, error.message);
    }
  }
}

async function main() {
  try {
    // Connect to MongoDB using the DB_URL from .env file
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Fetch the top 250 movies
    const topMovies = await fetchTopMovies();

    // Save them to the database
    await saveMoviesToDB(topMovies);
    
    
    console.log('Top 250 movies have been populated successfully.');

    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (error) {
    console.error('Error in main execution:', error.message);
  }
}

main();