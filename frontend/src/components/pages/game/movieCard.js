

import React from "react";
import Card from "react-bootstrap/Card";
//import "./MovieCard.css";

export default function MovieCard({ movie, onClick }) {
  return (
    <Card onClick={onClick} className="movie-card">
      <Card.Img
        variant="top"
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.overview.slice(0, 120)}...</Card.Text>
        <Card.Text>
          <strong>Release:</strong> {movie.release_date}
        </Card.Text>
        <Card.Text>
          <strong>Genres:</strong> {movie.genre_names.join(", ")}
        </Card.Text>
        <Card.Text>
          <strong>Language:</strong> {movie.original_language.toUpperCase()}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
