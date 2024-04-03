import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginUser } from "./authSlice";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.auth.error);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(loginUser(credentials));
    if (!error) {
      setCredentials({ email: "", password: "" });
    }
  };

  return (
    <Container className="mt-3">
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
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

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            required
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
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

export default Login;
