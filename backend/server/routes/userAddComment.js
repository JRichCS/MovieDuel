const express = require("express");
const router = express.Router();
const Comment = require("../models/commentModel");

// Add a comment
router.post("/movies/:movieId/comments", async (req, res) => {
  try {
    const { text, userId, username } = req.body;
    const { movieId } = req.params;

    if (!text || !userId || !username) {
      return res.status(400).json({ 
        error: "Text, userId, and username are required" 
      });
    }

    const newComment = new Comment({ 
      movieId, 
      userId, 
      username,  
      text 
    });
    
    await newComment.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;