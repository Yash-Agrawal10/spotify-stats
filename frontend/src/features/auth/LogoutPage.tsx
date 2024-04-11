import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useAppDispatch } from "../../app/state/hooks";
import { logout } from "./authSlice";
import { useNavigate } from "react-router-dom";

const LogoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="text-center">
          <h1>Logout</h1>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LogoutPage;
