import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="mt-auto py-3 bg-light">
      <Container>
        <Row>
          <Col className="text-center">
            <span className="text-muted">&copy; Spotify-Stats</span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
