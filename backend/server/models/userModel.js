const mongoose = require("mongoose");

// This schema defines the structure of the profile data in the database.
const newUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    email: {
      type: String,
      required: true,
      label: "email",
    },
    password: {
      required: true,
      type: String,
      min : 8
    },
    date: {
      type: Date,
      default: Date.now,
    },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user' 
    }

  },
  { collection: "users" }
);

module.exports = mongoose.model('users', newUserSchema)