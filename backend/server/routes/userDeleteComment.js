const express = require("express");
const router = express.Router();
const Comment = require("../models/commentModel");

// In your commentRoutes.js
router.delete("/movies/:movieId/comments/:commentId", async (req, res) => {
  try {
    const { commentId, movieId } = req.params;
    const { userId } = req.body;

    // 1. First verify the comment exists
    const comment = await Comment.findOne({
      _id: commentId,
      movieId: movieId
    });

    if (!comment) {
      // Check if comment exists under different movieId (common issue)
      const existsElsewhere = await Comment.exists({ _id: commentId });
      return res.status(404).json({ 
        error: existsElsewhere 
          ? "Comment exists but for a different movie" 
          : "Comment not found",
        commentId,
        movieId
      });
    }

    // 2. Verify ownership
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ 
        error: "Permission denied",
        yourUserId: userId,
        commentOwnerId: comment.userId
      });
    }

    // 3. Perform deletion
    const result = await Comment.deleteOne({ _id: commentId });
    
    if (result.deletedCount === 0) {
      return res.status(500).json({
        error: "Deletion failed unexpectedly",
        commentId
      });
    }

    res.status(200).json({ 
      message: "Comment deleted successfully",
      deletedComment: comment
    });
    
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ 
      error: "Server error",
      details: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        stack: err.stack
      } : undefined
    });
  }
});
  
  module.exports = router;