require('dotenv').config({ path: '../.env' });

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const Movie = require('../models/movieModel.js');

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DB_URL = process.env.DB_URL;
const CSV_FILE_PATH = path.join(__dirname, 'imdb_top_250.csv');

if (!DB_URL) {
  console.error('MongoDB connection URL is not defined in the .env file');
  process.exit(1);
}

if (!TMDB_API_KEY) {
  console.error('TMDB API key is not defined in the .env file');
  process.exit(1);
}

async function readCSV() {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function getTMDBFromIMDb(imdbID) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/find/${imdbID}`, {
      params: {
        api_key: TMDB_API_KEY,
        external_source: 'imdb_id',
      },
    });

    const movie = response.data.movie_results?.[0];
    return movie || null;
  } catch (err) {
    console.error(`Failed to look up TMDB movie for ${imdbID}: ${err.message}`);
    return null;
  }
}

async function fetchMovieDetails(tmdbID) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbID}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for TMDB ID ${tmdbID}:`, error.message);
    return null;
  }
}

async function saveMoviesToDB(moviesFromCSV) {
  for (let index = 0; index < moviesFromCSV.length; index++) {
    const csvRow = moviesFromCSV[index];
    const imdbID = csvRow.imdb_id?.trim();
    const IMDBRating = parseFloat(csvRow.rating);
    const Top250Ranking = index + 1;

    if (!imdbID || isNaN(IMDBRating)) {
      console.warn(`Skipping invalid row: ${JSON.stringify(csvRow)}`);
      continue;
    }

    try {
      const tmdbBasic = await getTMDBFromIMDb(imdbID);
      if (!tmdbBasic) {
        console.warn(`No TMDB match found for IMDb ID: ${imdbID}`);
        continue;
      }

      const movieDetails = await fetchMovieDetails(tmdbBasic.id);
      if (!movieDetails) {
        console.warn(`No details found for TMDB ID: ${tmdbBasic.id}`);
        continue;
      }

      const movieData = {
        imdbID,
        title: movieDetails.title,
        original_title: movieDetails.original_title || 'N/A',
        overview: movieDetails.overview || 'N/A',
        release_date: movieDetails.release_date || 'N/A',
        vote_average: movieDetails.vote_average || 0,
        vote_count: movieDetails.vote_count || 0,
        popularity: movieDetails.popularity || 0,
        poster_path: movieDetails.poster_path
          ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
          : '',
        backdrop_path: movieDetails.backdrop_path
          ? `https://image.tmdb.org/t/p/w500${movieDetails.backdrop_path}`
          : '',
        genre_ids: movieDetails.genres?.map(g => g.id) || [],
        genre_names: movieDetails.genres?.map(g => g.name) || [],
        original_language: movieDetails.original_language || 'N/A',
        actors: movieDetails.credits?.cast
          ? movieDetails.credits.cast
              .sort((a, b) => a.order - b.order)
              .slice(0, 3)
              .map((actor) => actor.name)
          : [],
        IMDBRating,
        Top250Ranking,
      };

      await Movie.updateOne(
        { imdbID },
        { $set: movieData },
        { upsert: true }
      );

      console.log(`Saved: ${movieData.title} (Rank ${Top250Ranking})`);
    } catch (error) {
      console.error(`Error saving movie ${imdbID}:`, error.message);
    }
  }
}

async function main() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🛠️  Connected to MongoDB');

    const moviesFromCSV = await readCSV();
    await saveMoviesToDB(moviesFromCSV);

    console.log('All movies updated successfully.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error in main execution:', error.message);
  }
}

main();
