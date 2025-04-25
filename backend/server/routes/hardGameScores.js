// gamescoreRoute.js
const express = require("express");
const router = express.Router();
const HardGameScore = require("../models/hardGameScoreModel");

// POST: Submit a new score
router.post("/:userId/score", async (req, res) => {
  try {
    const { userId } = req.params;  // Extract userId from URL parameter
    const { username, score } = req.body;  // Extract username and score from request body

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

    // Create a new game score with userId, username, and score
    const newScore = new HardGameScore({
      userId,
      username,
      score,
      timestamp,
    });

    // Save the new score to the database
    await newScore.save();
    res.status(201).json({ message: "Score saved", score: newScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Get the top score for a user
router.get("/:userId/scores", async (req, res) => {
  try {
    const { userId } = req.params;  // Extract userId from URL parameter

    // Find the top score for the specific user
    const topScore = await HardGameScore.findOne({ userId })
      .sort({ score: -1 })  // Sort scores in descending order
      .exec();

    if (!topScore) {
      return res.status(404).json({ message: "No scores found for this user" });
    }

    res.status(200).json(topScore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Get top scores (e.g., leaderboard)
router.get("/leaderboard", async (req, res) => {
  try {
    const topScores = await HardGameScore.find({})
      .sort({ score: -1 })  // Sort by highest score
      .limit(10)  // Get the top 10 scores

    res.status(200).json(topScores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
