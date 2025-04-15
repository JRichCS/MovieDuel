const mongoose = require("mongoose");

// This schema defines the structure of the profile picture data in the database.
const profilePictureSchema = new mongoose.Schema(
  {
    // User ID to distinguish between users
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    // The url for the users profile, which leads to the image itself
    pictureUrl: {
      type: String,
      required: true,
    },
  },
  // Add to own collection
  { collection: "profilePictures" }
);

module.exports = mongoose.model("ProfilePicture", profilePictureSchema);
