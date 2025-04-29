const express = require("express");
const app = express();
const cors = require('cors');
const axios = require('axios');

const userProfilePictureRoutes = require("./routes/userProfilePicture");

const loginRoute = require('./routes/userLogin')
const registerRoute = require('./routes/userSignUp')
const getUserByIdRoute = require('./routes/userGetUserById')
const dbConnection = require('./config/db.config')

const favoritesRoute = require("./routes/userFavorites");
const movieRoutes = require('./routes/movieRoutes');
const gameScoreRoutes = require('./routes/gameScores');
const hardGameScoreRoutes = require("./routes/hardGameScores");


const addcommentsRoute = require("./routes/userAddComment");
const getcommentsRoute = require("./routes/userGetComment");
const deletecommentRoute = require("./routes/userDeleteComment");
const proxyRoute = require("./routes/proxy");


require('dotenv').config();
const SERVER_PORT = 8081;

dbConnection();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/user', loginRoute);
app.use('/user', registerRoute);
app.use('/user', getUserByIdRoute);
app.use("/user", favoritesRoute);
app.use('/api', movieRoutes);
app.use("/api/game", gameScoreRoutes);
app.use("/api/hardGame", hardGameScoreRoutes)

app.use("/api", addcommentsRoute); 
app.use("/api", getcommentsRoute);
app.use("/api", deletecommentRoute);
app.use("/api/userProfilePicture", userProfilePictureRoutes);

// === New movie route handling ===
app.get("/api/movie", async (req, res) => {
  // Grabs the title from where it is submited in the page
  const { title } = req.query;

  if (!title) return res.status(400).json({ error: 'Missing movie title' });

  try {
    const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
    const response = await axios.get(url);

    // Check if the response content is HTML
    if (response.headers['content-type'].includes('html')) {
      return res.status(500).json({ error: 'Invalid API response: HTML received from OMDB API' });
    }

    // Returns the JSON movie info 
    res.json(response.data);
  } catch (err) {
    console.error('OMDb request failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
});
