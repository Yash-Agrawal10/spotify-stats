import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { useAppSelector } from "../../app/state/hooks";
import { selectAuth } from "../auth/authSlice";

const Header = () => {
  // Redux state
  const isLoggedIn = useAppSelector(selectAuth).isLoggedIn;

  // JSX
  const authLinks = (
    <>
      <Nav.Link href="/account">Account</Nav.Link>
      <Nav.Link href="/history">History</Nav.Link>
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
          <Nav className="me-auto">{isLoggedIn ? authLinks : guestLinks}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
