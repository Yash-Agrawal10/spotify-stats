import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import api from "../../app/api/api";
import { useNavigate } from "react-router-dom";
import { selectAuth, logout } from "../auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/state/hooks";
import { useEffect } from "react";
import { loadData } from "../../app/state/sessionStorage";

const HomePage: React.FC = () => {
  // Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux state
  const isLoggedIn = useAppSelector(selectAuth).isLoggedIn;

  // Effects
  useEffect(() => {
    const checkSpotifyAuth = async () => {
      if (isLoggedIn) {
        try {
          const headers = {
            Authorization: `Bearer ${loadData("access_token")}`,
          };
          const response = await api.get("/spotify/auth/", { headers });
          const redirect_url = response.data.auth_url;
          if (redirect_url) {
            window.location.href = redirect_url;
          }
        } catch (error) {
          console.log(error);
          dispatch(logout());
          navigate("/");
        }
      }
    };
    checkSpotifyAuth();
  }, [isLoggedIn]);

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
