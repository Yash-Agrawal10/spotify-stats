import React, { useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import api, { processError } from "../../app/api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"None" | "Success" | "Failure">("None");

  const togglePassword = () => setShowPassword(!showPassword);

  const registerUser = async (data: RegisterData) => {
    try {
      const response = await api.post("users/register/", data);
      setMessage(response.data.detail);
      setStatus("Success");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      const errorMessage = processError(error);
      setMessage(errorMessage);
      setStatus("Failure");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    registerUser({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    });
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h2>Register</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                onClick={togglePassword}
                className="mt-2"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </Button>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          {status !== "None" && (
            <Alert
              variant={status === "Success" ? "success" : "danger"}
              className="mt-3"
            >
              {message}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
