import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const HomePage: React.FC = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="text-center">
          <h1 className="display-4 fw-bold">Welcome to <br/> Spotify-Stats</h1>
          <p className="lead">
            Explore, discover, and immerse yourself in a universe of music. With Spotify-Stats, you're one click away from your next favorite song.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;