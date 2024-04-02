import { Container, Row, Col } from "react-bootstrap";

const Home = () => {
  return (
    <Container>
      <Row>
        <h1>This is the spotify-stats app home page.</h1>
      </Row>
      <Row>
        <h2>There is not a lot of content here yet.</h2>
      </Row>
      <Row>
        <Col>
          <h3>Each sentence should be in its own row.</h3>
        </Col>
        <Col>
          <h3>This should be in a different column.</h3>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
