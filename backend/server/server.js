const express = require("express");
const app = express();
const cors = require('cors')

const userProfilePictureRoutes = require("./routes/userProfilePicture");
const loginRoute = require('./routes/userLogin')
const getAllUsersRoute = require('./routes/userGetAllUsers')
const registerRoute = require('./routes/userSignUp')
const getUserByIdRoute = require('./routes/userGetUserById')
const dbConnection = require('./config/db.config')
const editUser = require('./routes/userEditUser')
const deleteUser = require('./routes/userDeleteAll')

const favoritesRoute = require("./routes/userFavorites.js");





const addcommentsRoute = require("./routes/userAddComment");
const getcommentsRoute = require("./routes/userGetComment")
const deletecommentRoute = require("./routes/userDeleteComment")


require('dotenv').config();
const SERVER_PORT = 8081

dbConnection()

app.use(cors({origin: '*'}))
app.use(express.json())
app.use('/user', loginRoute)
app.use('/user', registerRoute)
app.use('/user', getAllUsersRoute)
app.use('/user', getUserByIdRoute)
app.use('/user', editUser)
app.use('/user', deleteUser)

app.use("/user", favoritesRoute);


app.use("/api", addcommentsRoute); 
app.use("/api", getcommentsRoute);
app.use("/api", deletecommentRoute);

app.use("/api/userProfilePicture", userProfilePictureRoutes);

app.get('/api/movies', async (req, res) => {
    const { title } = req.query;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const apiKey = process.env.OMDB_API_KEY;
        const omdbUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`;
        const response = await axios.get(omdbUrl);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).json({ error: "Failed to fetch movie data" });
    }
});

app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})
