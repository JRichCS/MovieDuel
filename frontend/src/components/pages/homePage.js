import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";


const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4 display-4">🎬 Welcome to MovieDuel!</h1>

      <p className="lead">
        MovieDuel is an interactive and addictive game where you test your movie knowledge!
        Two movies will appear side-by-side, and your goal is to guess which one has the higher IMDb rating.
        Our game is powered by real-time IMDb data to keep things fresh and accurate.
      </p>

      <hr className="my-4" />

      <h3 className="mb-3">🔍 Browse Movies</h3>
      <p>
        Use the <strong>Search</strong> section on the navbar to look up any movie and see its details like IMDb rating,
        release year, genre, and more. It’s a great way to explore and learn before playing!
      </p>

      <hr className="my-4" />

      <h3 className="mb-3">🎮 Ready to Duel?</h3>
      <p>
        Go to the <strong>Game</strong> page and hit <strong>Play</strong> to start testing your movie smarts.
        Each round brings new films—see how far your streak can go!
      </p>
      <Button variant="success" className="mt-2" onClick={() => navigate("/game")}>
        Start Playing
      </Button>

      <hr className="my-4" />

      <h3 className="mb-3">👤 Account & Profile</h3>
      <p>
        Click on your profile in the navbar to view your account details like username, email, and user ID.
        You can also personalize your profile by updating your picture with a custom image URL.
      </p>
      <Button variant="primary" className="mt-2" onClick={() => navigate("/profile")}>
        Go to My Profile
      </Button>

      <hr className="my-4" />

      <h3 className="mb-3">🛡️ Multi-Factor Authentication (MFA)</h3>
      <p>
        To keep your account secure, MovieDuel is introducing <strong>Multi-Factor Authentication</strong> using
        <strong> Google Authenticator</strong>. After enabling it, you'll scan a QR code with the app to link your
        MovieDuel account. Every time you log in, you'll be asked for a one-time code from the app—adding an extra
        layer of protection against unauthorized access.
      </p>
      <Button variant="warning" className="mt-2" onClick={() => navigate("/setup-mfa")}>
        Set Up MFA with Google Authenticator
      </Button>

      <p className="mt-4 text-muted">
        Dive in, challenge friends, and prove you're the ultimate movie buff! 🍿
      </p>
    </div>
  );
};

export default HomePage;
