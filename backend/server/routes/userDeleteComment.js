const express = require("express");
const router = express.Router();
const Comment = require("../models/commentModel");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware to authenticate and decode the JWT
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;  // Attach user info to the request object
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

router.delete("/movies/:movieId/comments/:commentId", authenticate, async (req, res) => {
  try {
    const { commentId, movieId } = req.params;
    const { userId, role } = req.user;  // Extract userId and role from the decoded JWT

    // 1. Find the comment
    const comment = await Comment.findOne({
      _id: commentId,
      movieId: movieId
    });

    if (!comment) {
      const existsElsewhere = await Comment.exists({ _id: commentId });
      return res.status(404).json({ 
        error: existsElsewhere 
          ? "Comment exists but for a different movie" 
          : "Comment not found",
        commentId,
        movieId
      });
    }

    // 2. Check if user is allowed to delete
    const isOwner = comment.userId.toString() === userId;
    const isAdmin = role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        error: "Permission denied",
        yourUserId: userId,
        commentOwnerId: comment.userId,
        yourRole: role
      });
    }

    // 3. Delete the comment
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
