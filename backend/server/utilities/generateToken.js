const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateAccessToken = (userId, email, username, role) => {
    return jwt.sign(
        {
            id: userId,
            email,
            username,
            role // This will be the correct role (admin/user)
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1m' 
        }
    );
};

module.exports.generateAccessToken = generateAccessToken;
