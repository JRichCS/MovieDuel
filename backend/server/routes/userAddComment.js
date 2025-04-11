const express = require("express");
const router = express.Router();
const Comment = require("../models/commentModel");

// Add a comment
router.post("/movies/:movieId/comments", async (req, res) => {
  try {
    const { text, userId } = req.body;
    const { movieId } = req.params;

    if (!text || !userId) {
      return res.status(400).json({ error: "Text and userId are required" });
    }

    const newComment = new Comment({ movieId, userId, text });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;