import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="mt-auto py-3 bg-light">
      <Container>
        <Row>
          <Col>
            <p>&copy; {new Date().getFullYear()} Spotify-Stats</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
