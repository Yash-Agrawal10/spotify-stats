import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api, { processError } from "../../app/api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Interfaces
interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  // Local State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"None" | "Success" | "Failure">("None");

  // Event handlers
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

  // JSX
  return (
    <Container className="mt-2">
      <h2>Register</h2>
      <Form className="mt-3" onSubmit={handleSubmit}>
        <Form.Group className="mt-2" controlId="formBasicEmail">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mt-2" controlId="formBasicEmail">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mt-2" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mt-2" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          Submit
        </Button>
      </Form>
      {status !== "None" && (
        <Alert variant={status === "Success" ? "success" : "danger"}>
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default RegisterPage;
