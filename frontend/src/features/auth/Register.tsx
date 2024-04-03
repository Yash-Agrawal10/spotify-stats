import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const Register= () => {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here, you would typically send the data to your backend server
    console.log({ email, password });
    setEmail('');
    setPassword('');
  };

  return (
    <Container className="mt-3">
      <h2>Register</h2>
      <Form onSubmit={handleSubmit}>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        <Button className="mt-3 mb-3" variant="primary" type="submit">
          Submit
        </Button>

      </Form>
    </Container>
  );
}

export default Register;
