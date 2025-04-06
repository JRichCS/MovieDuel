import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ReactNavbar from "react-bootstrap/Navbar";

export default function Navbar() {
  const [user, setUser] = useState({});
  const [profilePicture, setProfilePicture] = useState("");

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

  return (
    <ReactNavbar bg="dark" variant="dark">
      <Container>
        <Nav className="me-auto">
          <Nav.Link href="/">Start</Nav.Link>
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
          <Nav.Link href="/search">Search</Nav.Link>
        </Nav>

        {user?.id && (
  <img
    src={profilePicture}
    alt="Profile"
    className="rounded-circle"
    width="50"
    height="50"
  />
)}
      </Container>
    </ReactNavbar>
  );
}
