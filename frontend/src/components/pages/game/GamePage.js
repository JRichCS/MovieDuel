import React, { useEffect, useState } from "react";
import axios from "axios";
import getUserInfo from "../../../utilities/decodeJwt";
//import "./GamePage.css";

export default function GamePage() {
  const [movies, setMovies] = useState([]);
  const [score, setScore] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]); // Normal mode leaderboard state
  const [hasMadeChoice, setHasMadeChoice] = useState(false); // Track if a choice has been made
  const [hardMode, setHardMode] = useState(false); // Track if hard mode is enabled
  const [hardLeaderboard, setHardLeaderboard] = useState([]); // Hard mode leaderboard state

  useEffect(() => {
    if (gameStarted) {
      fetchMovies();
    }
  }, [gameStarted]);

  useEffect(() => { // Arrow key support
    const handleKeyDown = (event) => {
      if (!gameStarted || gameOver || hasMadeChoice) return;

      if (event.key === "ArrowLeft") {
        handleGuess(0);
      } else if (event.key === "ArrowRight") {
        handleGuess(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, gameOver, hasMadeChoice, movies]);

  const fetchLeaderboard = async () => {
    try {
      const easyRes = await axios.get("http://localhost:8081/api/game/leaderboard");
      const hardRes = await axios.get("http://localhost:8081/api/hardGame/leaderboard");

      const attachPics = async (data) => {
        return Promise.all(
          data.map(async (entry) => {
            try {
              const picRes = await axios.get(`http://localhost:8081/api/userProfilePicture/${entry.userId}`);
              return { ...entry, profilePicture: picRes.data.pictureUrl };
            } catch {
              return { ...entry, profilePicture: "/default-profile.jpg" };
            }
          })
        );
      };

      setLeaderboard(await attachPics(easyRes.data));
      setHardLeaderboard(await attachPics(hardRes.data));
    } catch (err) {
      console.error("Error fetching leaderboards:", err);
    }
  };

  const fetchMovies = async () => {
    try {
      let response;
      if (hardMode) {
        response = await axios.get("http://localhost:8081/api/randomMoviesWithRange"); // New route for hard mode
      } else {
        response = await axios.get("http://localhost:8081/api/randomMovies");
      }
      setMovies(response.data);
      setMessage("");
      setHasMadeChoice(false); // Reset choice flag for new round
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleGuess = (selectedIndex) => {
    if (gameOver || movies.length < 2 || hasMadeChoice) return; // Prevent actions if game is over or choice is already made

    const [movie1, movie2] = movies;
    const correctIndex =
      parseFloat(movie1.vote_average) > parseFloat(movie2.vote_average) ? 0 : 1;

    if (selectedIndex === correctIndex) {
      setMessage("Correct!");
      setScore((prev) => prev + 1);
    } else {
      setMessage("Incorrect!");
      setWrongGuesses((prev) => {
        const newWrong = prev + 1;
        if (newWrong >= 3) {
          setGameOver(true);
          saveScore(score); // Save score when game ends
        } else {
          setTimeout(fetchMovies, 1000);
        }
        return newWrong;
      });
    }
    
    setHasMadeChoice(true); // Set choice made flag to true
    setTimeout(fetchMovies, 1000); // Proceed to the next set of movies after a delay
  };

  const saveScore = async (finalScore) => {
    try {
      const userInfo = getUserInfo();
      if (!userInfo) {
        alert("You must be logged in to save your score.");
        return;
      }

      // Save score to the database
      await axios.post(`http://localhost:8081/api/hardGame/${userInfo.id}/score`, {
        username: userInfo.username,
        score: finalScore,
      });

      // Fetch leaderboard only after score is saved
      fetchLeaderboard();
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setWrongGuesses(0);
    setGameOver(false);
    setMessage("");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
      {gameStarted ? (
        <>
          {message && (
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              bg-gray-800 px-6 py-4 rounded-lg shadow-lg text-2xl font-semibold z-50
              ${message === "Correct!" ? "text-green-400" : message === "Incorrect!" ? "text-red-400" : ""}`}
            >
              {message}
            </div>
          )}

          <h1 className="text-4xl font-bold mb-6">Which Movie Has the Higher IMDb Rating?</h1>
          {gameOver ? (
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
              <h2 className="text-3xl font-semibold">Game Over!</h2>
              <p className="text-xl mt-4">Your Score: {score}</p>
              <p className="text-xl">Wrong Guesses: {wrongGuesses}</p>

            {/* Leaderboard Display */}
            <div id="leaderboard-section" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Easy Mode */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Normal Mode Leaderboard</h3>
              <table className="w-full table-auto text-left text-gray-300">
                <thead>
                  <tr className="text-yellow-400 border-b border-gray-700">
                    <th className="p-2">#</th>
                    <th className="p-2">Profile</th>
                    <th className="p-2">Username</th>
                    <th className="p-2">Score</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">
                        <img
                          src={entry.profilePicture}
                          alt={entry.username}
                          className="rounded-full w-10 h-10"
                        />
                      </td>
                      <td className="p-2">{entry.username}</td>
                      <td className="p-2">{entry.score}</td>
                      <td className="p-2">{entry.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Hard Mode */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Hard Mode Leaderboard</h3>
              <table className="w-full table-auto text-left text-gray-300">
                <thead>
                  <tr className="text-yellow-400 border-b border-gray-700">
                    <th className="p-2">#</th>
                    <th className="p-2">Profile</th>
                    <th className="p-2">Username</th>
                    <th className="p-2">Score</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {hardLeaderboard.map((entry, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">
                        <img
                          src={entry.profilePicture}
                          alt={entry.username}
                          className="rounded-full w-10 h-10"
                        />
                      </td>
                      <td className="p-2">{entry.username}</td>
                      <td className="p-2">{entry.score}</td>
                      <td className="p-2">{entry.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md"
              >
                Play Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6 mb-6">
                {movies.map((movie, index) => (
                  <div
                    key={movie._id}
                    className="bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col items-center justify-between"
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/default-poster.jpg"
                      }
                      alt={movie.title}
                      className="w-full h-[400px] object-contain rounded-md mb-4"
                    />
                    <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                    <p className="text-gray-300 text-center mb-2">Release: {movie.release_date}</p>
                    <p className="text-gray-300 text-center mb-2">Genres: {movie.genre_names.join(", ")}</p>
                    <p className="text-gray-300 text-center mb-2">Actors: {movie.actors.join(", ")}</p>

                    <p className="text-gray-200 text-center mb-4">{movie.overview}</p>
                    <button
                      onClick={() => handleGuess(index)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md"
                      disabled={hasMadeChoice} // Disable button after a choice is made
                    >
                      Choose This Movie
                    </button>
                  </div>
                ))}
              </div>
              <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-center items-center space-x-8 text-xl">
                <p>Score: {score}</p>
                <p>Wrong guesses: {wrongGuesses}/3</p>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
            <h1 className="text-4xl font-bold mb-6">Welcome to the Movie Rating Game!</h1>
            <p className="text-lg mb-6">
              Instructions: You will be shown two movies and their details. Your goal is to choose which one has the higher IMDb rating. If you get it wrong three times, the game will end.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
              >
                Start Game
              </button>

              <button
                onClick={() => setHardMode(!hardMode)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-md"
              >
                {hardMode ? "Switch to Easy Mode" : "Switch to Hard Mode"}
              </button>

              <button
                onClick={async () => {
                   // Fetch leaderboard when button is clicked
                  startGame(true); // Set the state to show the leaderboard
                  setGameOver(true);
                  fetchLeaderboard();
                  
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-md"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
