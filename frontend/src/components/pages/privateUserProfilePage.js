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

  // Handle logout button
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Fetch user data
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

  // Handle updating profile picture
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

  return (
    <div className="container">
      <div className="col-md-12 text-center">
        <h1>{user.username}</h1>
        <img src={profilePicture || "https://via.placeholder.com/150"} alt="Profile" className="rounded-circle" width="150" height="150" />
        
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

          <Button className="mt-2 ms-2" onClick={handleShow}>
            Log Out
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
