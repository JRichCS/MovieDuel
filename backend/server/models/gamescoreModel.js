// gamescoreModel.js
const mongoose = require("mongoose");

const gameScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // must match exactly
    required: true,
  },
  username:{
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("GameScore", gameScoreSchema);
