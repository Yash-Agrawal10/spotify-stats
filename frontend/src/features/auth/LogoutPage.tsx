import React from "react";
import { Button } from "react-bootstrap";
import { useAppDispatch } from "../../app/state/hooks";
import { logout } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "react-bootstrap";

const LogoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Container>
      <Row>
        <h1>Logout</h1>
      </Row>
      <Row>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </Row>
    </Container>
  );
};

export default LogoutPage;
