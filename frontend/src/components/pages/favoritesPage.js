import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import getUserInfo from "../../utilities/decodeJwt";

const FavMovie = () => {
  const [favoritedMovies, setFavoritedMovies] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
      fetchFavoritedMovies(userInfo.id);
    }
  }, []);

  const fetchFavoritedMovies = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8081/user/${userId}/favorites`);
      const rawFavorites = response.data;

      // Now fetch full movie info from OMDb for each movieId
      const detailedFavorites = await Promise.all(
        rawFavorites.map(async (fav) => {
          try {
            const res = await fetch(`http://localhost:8081/api/movie?title=${encodeURIComponent(fav.title)}`);
            const data = await res.json();
            return { ...fav, poster: data.Poster || "", year: data.Year || "", imdbID: data.imdbID };
          } catch (err) {
            console.error("Error fetching movie details:", err);
            return fav;
          }
        })
      );

      setFavoritedMovies(detailedFavorites);
    } catch (error) {
      console.error("Failed to fetch favorited movies:", error.response || error);
    }
  };

  const removeFromFavorites = async (movieId) => {
    try {
      await axios.delete(`http://localhost:8081/user/${user.id}/favorites/${movieId}`);
      fetchFavoritedMovies(user.id);
    } catch (error) {
      console.error("Error removing from favorites:", error);
      alert("Failed to remove movie.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Your Favorite Movies</h1>

      {favoritedMovies.length > 0 ? (
        <div className="row">
          {favoritedMovies.map((fav) => (
            <div key={fav.movieId} className="col-md-3 mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={fav.poster !== "N/A" ? fav.poster : 'https://via.placeholder.com/300'}
                  alt={fav.title}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title className="fs-6">{fav.title} ({fav.year})</Card.Title>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromFavorites(fav.movieId)}
                  >
                    Unfavorite
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">You have no favorite movies yet.</p>
      )}
    </div>
  );
};

export default FavMovie;
