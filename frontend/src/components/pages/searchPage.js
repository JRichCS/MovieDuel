import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const SearchMovie = () => {
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userId] = useState('65d5f3d2a3b4d8e1a2c9e4f6'); // Replace with actual user ID
  const [title, setTitle] = useState('Inception');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch movie details
  const fetchMovie = async () => {

    const apiKey = process.env.REACT_APP_OMDB_API_KEY; // Grab API key from .env file

    if (!title.trim()) {
      alert("Please enter a movie title.");
      return;
    }

    const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "False") {
        setError(data.Error);
        setMovie(null);
        setComments([]);
      } else {
        setMovie(data);
        setError(null);
        fetchComments(data.imdbID); // Fetch comments for the movie
      }
    } catch (error) {
      console.error("Error fetching movie:", error);
      setError("Failed to fetch movie data.");
      setMovie(null);
      setComments([]);
    }
  };

  // Fetch comments from backend
  const fetchComments = async (movieId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/movies/${movieId}/comments`);
      setComments(response.data);
    } catch (error) {
      // If no comments found, set comments as an empty array
      if (error.response && error.response.status === 404) {
        setComments([]);
      } else {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    }
  };

  // Add new comment to the backend
  const addComment = async () => {
    if (!newComment.trim()) return alert("Comment cannot be empty.");

    try {
      const response = await axios.post(`http://localhost:8081/api/movies/${movie.imdbID}/comments`, {
        text: newComment,
        userId, // This should be a valid ObjectId string
      });

      // Add the new comment to the existing list of comments
      setComments([...comments, response.data]);
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment.");
    }
  };

  return (
    <div className="container text-center mt-4">
      <h1>Movie Information</h1>
      <div className="d-flex justify-content-center mb-3">
        <input
          type="text"
          placeholder="Enter movie title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control w-50"
        />
        <Button onClick={fetchMovie} variant="primary" className="ms-2">
          Search
        </Button>
      </div>

      {error && <p className="text-danger mt-3">{error}</p>}

      {movie && (
        <>
          <Card className="mt-4" style={{ width: '18rem', margin: 'auto' }}>
            <Card.Img variant="top" src={movie.Poster} alt={movie.Title} />
            <Card.Body>
              <Card.Title>{movie.Title} ({movie.Year})</Card.Title>
              <Card.Text>
                <strong>Genre:</strong> {movie.Genre} <br />
                <strong>Director:</strong> {movie.Director} <br />
                <strong>Plot:</strong> {movie.Plot}
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Comment Section */}
          <div className="mt-4">
            <h3>Comments</h3>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="border p-2 my-2">
                  <strong>User {comment.userId}:</strong> {comment.text}
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to add one!</p>
            )}

            <Form className="mt-3">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </Form.Group>
              <Button onClick={addComment} variant="success" className="mt-2">
                Add Comment
              </Button>
            </Form>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchMovie;
