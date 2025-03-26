import { useState, useEffect } from "react";

const MovieComments = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8096/movies/${movieId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error(err));
  }, [movieId]);

  const handleCommentSubmit = async () => {
    await fetch(`http://localhost:8096/movies/${movieId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newComment, userId: "USER_ID_HERE" }),
    });

    setNewComment("");
    window.location.reload(); // Refresh comments after adding one
  };

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((c) => (
        <p key={c._id}><strong>{c.userId.username}:</strong> {c.text}</p>
      ))}
      <input 
        type="text" 
        value={newComment} 
        onChange={(e) => setNewComment(e.target.value)} 
      />
      <button onClick={handleCommentSubmit}>Add Comment</button>
    </div>
  );
};

export default MovieComments;
