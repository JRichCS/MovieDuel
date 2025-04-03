const express = require("express");
const router = express.Router();
const Comment = require("../models/commentModel");


// GET comments route
router.get("/movies/:movieId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.movieId })
      .select('text userId username createdAt') // Explicitly include username
      .sort({ createdAt: -1 })
      .lean();
      
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;