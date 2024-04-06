import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const HomePage: React.FC = () => {
  return (
    <Container>
      <Row className="mt-5">
        <Col md={{ span: 6, offset: 3 }} className="text-center">
          <h1>Welcome to Our Website</h1>
          <p>
            This is a simple home page created using React, TypeScript, and
            React Bootstrap.
          </p>
          <p>
            Here, you can find an example of how to structure a page with some
            basic content.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
