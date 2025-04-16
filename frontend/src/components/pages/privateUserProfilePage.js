import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [profilePicture, setProfilePicture] = useState("");
  const [newPictureUrl, setNewPictureUrl] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);

    if (userInfo?.id) {
      fetch(`http://localhost:8081/api/userProfilePicture/${userInfo.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.pictureUrl) setProfilePicture(data.pictureUrl);
        })
        .catch((err) => console.error("Error fetching profile picture:", err));
    }
  }, []);

  const updateProfilePicture = () => {
    if (!newPictureUrl) {
      alert("Please enter a valid image URL.");
      return;
    }

    fetch("http://localhost:8081/api/userProfilePicture/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, pictureUrl: newPictureUrl }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.pictureUrl) {
          setProfilePicture(data.pictureUrl);
          alert("Profile picture updated successfully!");
        } else {
          alert("Failed to update profile picture.");
        }
      })
      .catch((err) => console.error("Error updating profile picture:", err));
  };

  if (!user) return <div><h4>Log in to view this page.</h4></div>;

  const { username, id, email } = user;

  return (
    <div className="container">
      <div className="col-md-12 text-center">
        <h1>{username}</h1>
        <img
          src={profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
          className="rounded-circle"
          width="150"
          height="150"
        />

        <div className="col-md-12 text-center mt-3">
          <input
            type="text"
            placeholder="Enter image URL"
            value={newPictureUrl}
            onChange={(e) => setNewPictureUrl(e.target.value)}
            className="form-control"
          />
          <Button className="mt-2" onClick={updateProfilePicture}>
            Update Profile Picture
          </Button>

          {/* Profile Info */}
          <div className="grid gap-3 mt-4">
            <div className="bg-dark text-white rounded-2xl p-3 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">👤 Username</h3>
              <p className="text-lg">{username}</p>
            </div>
            <div className="bg-dark text-white rounded-2xl p-3 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">🆔 User ID</h3>
              <p className="text-lg break-all">{id}</p>
            </div>
            <div className="bg-dark text-white rounded-2xl p-3 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">📧 Email</h3>
              <p className="text-lg">{email}</p>
            </div>
          </div>

          <Button className="mt-4" variant="danger" onClick={handleShow}>
            🚪 Log Out
          </Button>

          <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>Log Out</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to Log Out?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Close</Button>
              <Button variant="primary" onClick={handleLogout}>Yes</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserProfile;
