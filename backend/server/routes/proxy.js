require('dotenv').config(); 
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 8080;
const API_KEY = process.env.OMDB_API_KEY;

// Initialize a router instance
const router = express.Router();

// Define the route in the router instance
router.get('/api/movie', async (req, res) => {
    const { title } = req.query;

    if (!title) return res.status(400).json({ error: 'Missing movie title' });

    try {
        const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`;
        const response = await axios.get(url);

        // Check if the response content is HTML
        if (response.headers['content-type'].includes('html')) {
            return res.status(500).json({ error: 'Invalid API response: HTML received from OMDB API' });
        }

        res.json(response.data);
    } catch (err) {
        console.error('OMDb request failed:', err.message);
        res.status(500).json({ error: 'Failed to fetch movie data' });
    }
});

// Use the router for API routes
app.use(router);  // This line correctly adds the router as middleware

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
