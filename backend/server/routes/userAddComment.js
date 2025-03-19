const express = require("express");
const router = express.Router();
const commentModel = require("../models/commentModel");

// Route to add a comment for a movie
router.post("/comment", async (req, res) => {
  try {
    const { userId, movieId, title, comment } = req.body;

    // If any fields are empty return error
    if (!userId || !movieId || !title || !comment) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new comment document
    const newComment = new commentModel({
      userId,
      movie: { movieId, title },
      comment,
    });

    // Save comment to the database
    await newComment.save();

    res.status(201).json({ message: "Comment added successfully.", newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
