// src/components/DashboardPage.tsx
import React from "react";
import { Container, Card } from "react-bootstrap";
import { useAppSelector } from "../../app/state/hooks";
import { selectAuth } from "../auth/authSlice";

const UserPage: React.FC = () => {
  // Redux state
  const user = useAppSelector(selectAuth).user;
  const error = useAppSelector(selectAuth).error;

  // Helpers
  const parseDate = (date: string) => {
    const parsedDate = new Date(date);
    const formattedDate = parsedDate.toLocaleDateString("en-US");
    return formattedDate;
  };

  // JSX
  return (
    <Container className="mt-5 mb-5">
      <Card>
        <Card.Header as="h5">User Details</Card.Header>
        <Card.Body>
          {user ? (
            <div>
              <Card.Text>First Name: {user.first_name}</Card.Text>
              <Card.Text>Last Name: {user.last_name}</Card.Text>
              <Card.Text>Email: {user.email}</Card.Text>
              <Card.Text>Date Joined: {parseDate(user.date_joined)}</Card.Text>
            </div>
          ) : (
            <Card.Text>{error}</Card.Text>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserPage;
