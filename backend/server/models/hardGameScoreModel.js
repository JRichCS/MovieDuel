// hardGameScoreModel.js
const mongoose = require("mongoose");

const hardGameScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
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
  timestamp: { type: String },
});

module.exports = mongoose.model("HardGameScore", hardGameScoreSchema);
