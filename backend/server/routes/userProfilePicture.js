const express = require("express");
const router = express.Router();
const ProfilePicture = require("../models/profilePicture");

// Route to update or create profile picture
router.post("/update", async (req, res) => {
  try {
    const { userId, pictureUrl } = req.body;

    if (!userId || !pictureUrl) {
      return res.status(400).json({ message: "User ID and picture URL are required." });
    }

    let profilePicture = await ProfilePicture.findOne({ userId });

    if (profilePicture) {
      // Update existing profile picture
      profilePicture.pictureUrl = pictureUrl;
      await profilePicture.save();
    } else {
      // Create new profile picture entry
      profilePicture = new ProfilePicture({ userId, pictureUrl });
      await profilePicture.save();
    }

    res.status(200).json({ message: "Profile picture updated successfully!", pictureUrl });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get Profile Picture by User ID
router.get("/:userId", async (req, res) => {
  try {
    const profilePicture = await ProfilePicture.findOne({ userId: req.params.userId });

    if (!profilePicture) {
      return res.status(404).json({ message: "Profile picture not found" });
    }

    res.status(200).json({ pictureUrl: profilePicture.pictureUrl });
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
