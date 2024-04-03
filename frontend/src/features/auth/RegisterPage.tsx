import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api from "../../app/api/api";
import { isAxiosError } from "axios";

const RegisterPage: React.FC = () => {
  // Interfaces
  interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }
  interface ErrorResponse {
    type: "success" | "error" | "none";
    detail: string;
  }

  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({
    type: "none",
    detail: "",
  } as ErrorResponse);

  // Handle form submission
  const registerUser = async (data: RegisterData) => {
    let message = "An unexpected error occurred. Please try again.";
    let success = true;
    try {
      const response = await api.post("users/register/", data);
      message = response.data.detail;
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        message = error.response.data.detail || message;
      }
      success = false;
    }
    const type = success ? "success" : "error";
    setMessage({ type: type, detail: message });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here, you would typically send the data to your backend server
    registerUser({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    });
  };

  return (
    <Container className="mt-3">
      <h2>Register</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button className="mt-3 mb-3" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {message.type !== "none" && (
        <Alert variant={message.type === "success" ? "success" : "danger"}>
          {message.detail}
        </Alert>
      )}
    </Container>
  );
};

export default RegisterPage;
