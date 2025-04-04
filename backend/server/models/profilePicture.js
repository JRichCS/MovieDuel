const mongoose = require("mongoose");

const profilePictureSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    pictureUrl: {
      type: String,
      required: true,
    },
  },
  { collection: "profilePictures" }
);

module.exports = mongoose.model("ProfilePicture", profilePictureSchema);
// This schema defines the structure of the profile picture data in the database.