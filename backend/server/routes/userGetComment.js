const express = require("express");
const router = express.Router();
const Comment = require("../models/commentModel");

// Get comments for a movie
router.get("/movies/:movieId/comments", async (req, res) => {
  try {
    const { movieId } = req.params;
    const comments = await Comment.find({ movieId });

    // Return an empty array if no comments are found
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;