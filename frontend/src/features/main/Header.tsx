import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { useSelector } from "react-redux";
import { selectAuth } from "../auth/authSlice";

const Header = () => {
  const auth = useSelector(selectAuth);

  const authLinks = (
    <>
      <Nav.Link href="/dashboard">Dashboard</Nav.Link>
      <Nav.Link href="/logout">Log Out</Nav.Link>
    </>
  );

  const guestLinks = (
    <>
      <Nav.Link href="/register">Register</Nav.Link>
      <Nav.Link href="/login">Log In</Nav.Link>
    </>
  );

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Spotify-Stats</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {auth.isLoggedIn ? authLinks : guestLinks}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
