const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    imdbID: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    original_title: {
      type: String,
    },
    overview: {
      type: String,
    },
    release_date: {
      type: String, // Format "YYYY-MM-DD"
    },
    vote_average: {
      type: Number,
    },
    vote_count: {
      type: Number,
    },
    popularity: {
      type: Number,
    },
    poster_path: {
      type: String,
    },
    backdrop_path: {
      type: String,
    },
    genre_ids: {
      type: [Number], // Store genre IDs
    },
    genre_names: {
        type: [String], //initially empty, must convert from id to string
    },
    original_language: {
      type: String,
    },
    actors: {
      type: [String],
    },
    IMDBRating: {
      type: Number,
    },
    Top250Ranking: {
      type: Number,
    },
  },
  {
    collection: "movies",
    timestamps: true,
  }
);

module.exports = mongoose.model("Movie", movieSchema);
