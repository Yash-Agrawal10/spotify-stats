// src/components/DashboardPage.tsx
import React from "react";
import { Container, Card } from "react-bootstrap";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../auth/authSlice";

const DashboardPage: React.FC = () => {
  const auth = useAppSelector(selectAuth);

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h5">User Details</Card.Header>
        <Card.Body>
          {auth && auth.user ? (
            <div>
              <Card.Text>Email: {auth.user.email}</Card.Text>
              <Card.Text>First Name: {auth.user.first_name}</Card.Text>
              <Card.Text>Last Name: {auth.user.last_name}</Card.Text>
            </div>
          ) : (
            <Card.Text>User is not authenticated</Card.Text>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DashboardPage;
