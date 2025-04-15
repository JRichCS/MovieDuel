const express = require("express");
const router = express.Router();
const { userLoginValidation } = require('../models/userValidator');
const newUserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../utilities/generateToken');

router.post('/login', async (req, res) => {
  // Validate user input
  const { error } = userLoginValidation(req.body);
  if (error) return res.status(400).send({ message: error.errors[0].message });

  const { username, password } = req.body;

  // Find the user by username
  const user = await newUserModel.findOne({ username: username });
  
  // Check if the user exists
  if (!user) {
    return res.status(401).send({ message: "Invalid username or password" });
  }

  // Check if the password is correct
  const checkPasswordValidity = await bcrypt.compare(password, user.password);
  if (!checkPasswordValidity) {
    return res.status(401).send({ message: "Invalid username or password" });
  }

  // Create a JWT (Exclude password from the token)
  const accessToken = generateAccessToken(user._id, user.email, user.username, user.role);

  // Send the token back in the response body
  res.status(200).send({ accessToken });
});

module.exports = router;
