import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import getUserInfo from "../../utilities/decodeJwt";

const SearchMovie = () => {
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('Inception');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovie();
    const userInfo = getUserInfo();
    if (userInfo) setUser(userInfo);
  }, []);

  const fetchMovie = async () => {
    const apiKey = process.env.REACT_APP_OMDB_API_KEY;
    if (!title.trim()) {
      alert("Please enter a movie title.");
      return;
    }

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`);
      const data = await response.json();

      if (data.Response === "False") {
        setError(data.Error);
        setMovie(null);
        setComments([]);
      } else {
        setMovie(data);
        setError(null);
        fetchComments(data.imdbID);
      }
    } catch (error) {
      console.error("Error fetching movie:", error);
      setError("Failed to fetch movie data.");
      setMovie(null);
      setComments([]);
    }
  };

  const fetchComments = async (movieId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/movies/${movieId}/comments`);
      console.log("Comments data:", response.data); // Debugging line
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return alert("Comment cannot be empty.");
    if (!user) {
      alert("You must be logged in to comment.");
      navigate('/login');
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:8081/api/movies/${movie.imdbID}/comments`,
        {
          text: newComment,
          userId: user.id,
          username: user.username // Ensure username is included
        }
      );
      
      // Force include username in frontend state
      setComments([{
        ...response.data,
        username: user.username
      }, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment.");
    }
  };

  const deleteComment = async (commentId) => {
    if (!user) {
      alert("You must be logged in to delete comments.");
      navigate('/login');
      return;
    }
  
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/movies/${movie.imdbID}/comments/${commentId}`,
        { 
          data: { 
            userId: user.id 
          } 
        }
      );
  
      if (response.status === 200) {
        setComments(comments.filter(c => c._id !== commentId));
        alert("Comment deleted successfully");
      }
    } catch (error) {
      console.error("Delete error:", error);
      
      // Enhanced error handling
      if (error.response) {
        if (error.response.status === 403) {
          alert(error.response.data.error);
        } else if (error.response.status === 404) {
          alert("Comment not found - it may have already been deleted");
        } else {
          alert("Failed to delete comment. Please try again.");
        }
      } else {
        alert("Network error - please check your connection");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Movie Information</h1>
      <div className="d-flex justify-content-center mb-3">
        <Form.Control
          type="text"
          placeholder="Enter movie title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-50"
        />
        <Button onClick={fetchMovie} variant="primary" className="ms-2">
          Search
        </Button>
      </div>
  
      {error && <p className="text-danger text-center">{error}</p>}
  
      {movie && (
        <div className="row">
          {/* Movie Card - Left Side */}
          <div className="col-md-6">
            <Card className="mt-4">
              <div className="d-flex">
                {/* Poster on the left */}
                <div style={{ width: '200px', flexShrink: 0 }}>
                  <Card.Img 
                    variant="top" 
                    src={movie.Poster} 
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover'
                    }} 
                  />
                </div>
                
                {/* Movie info on the right */}
                <Card.Body className="p-3">
                  <Card.Title>{movie.Title} ({movie.Year})</Card.Title>
                  <Card.Text>
                    <strong>Genre:</strong> {movie.Genre}<br />
                    <strong>Director:</strong> {movie.Director}<br />
                    <strong>Plot:</strong> {movie.Plot}
                  </Card.Text>
                </Card.Body>
              </div>
            </Card>
          </div>
  
          {/* Comments Section - Right Side */}
          <div className="col-md-6">
            <div className="mt-4">
              <h3>Comments</h3>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="border p-3 my-2 position-relative">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <span className="badge bg-primary me-2">
                            {comment.username || `User_${comment.userId?.toString().slice(-4)}`}
                          </span>
                          {comment.createdAt && (
                            <small className="text-muted">
                              {new Date(comment.createdAt).toLocaleString()}
                            </small>
                          )}
                        </div>
                        <p className="mb-0">{comment.text}</p>
                      </div>
                      {user?.id === comment.userId && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteComment(comment._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No comments yet. {user ? 'Be the first to add one!' : 'Log in to add a comment.'}</p>
              )}
  
              {user && (
                <Form className="mt-3">
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </Form.Group>
                  <Button onClick={addComment} variant="success" className="mt-2">
                    Add Comment
                  </Button>
                </Form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );}
export default SearchMovie;