import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

type HeaderProps = {
  loggedIn: boolean;
};

const Header = ({ loggedIn }: HeaderProps) => {
  return (
    <>
      {loggedIn && <h1>Logged in</h1>}
      {!loggedIn && (
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/">Spotify-Stats</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="register">Sign Up</Nav.Link>
                <Nav.Link href="login">Log In</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
};

export default Header;
