import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/state/hooks";
import { selectAuth } from "./authSlice";
import { loginUser } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginPage: React.FC = () => {
  // Local state
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  // Redux state
  const error = useAppSelector(selectAuth).error;
  const isLoggedIn = useAppSelector(selectAuth).isLoggedIn;
  // Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Event handlers
  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(loginUser(credentials));
  };

  // Redirect to home if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // JSX
  return (
    <Container className="mt-3">
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mt-2" controlId="formBasicUsername">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            type="email"
            required
            placeholder="Enter email"
            value={credentials.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mt-2" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Enter password"
            value={credentials.password}
            onChange={handleChange}
          />
          <Button
            className="mt-2"
            variant="outline-secondary"
            onClick={togglePassword}
            style={{ zIndex: 0 }}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </Button>
        </Form.Group>

        <Button className="mt-3 mb-3" variant="primary" type="submit">
          Login
        </Button>
      </Form>

      <Alert variant="danger" hidden={!error}>
        {error}
      </Alert>
    </Container>
  );
};

export default LoginPage;
