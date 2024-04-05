// src/components/DashboardPage.tsx
import React, { useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/state/hooks";
import { selectAuth } from "../auth/authSlice";
import { selectUser } from "./userSlice";
import { fetchUser } from "./userSlice";
import { loadData } from "../../app/state/sessionStorage";

const UserPage: React.FC = () => {
  // Local state
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);

  // Helpers
  const parseDate = (date: string) => {
    const parsedDate = new Date(date);
    const formattedDate = parsedDate.toLocaleDateString("en-US");
    return formattedDate;
  };

  // Effects
  useEffect(() => {
    if (auth.isLoggedIn) {
      const token = loadData("access_token");
      console.log("Token: ", token);
      if (token) {
        dispatch(fetchUser(token));
      }
    }
  }, [auth.isLoggedIn, dispatch]);

  // JSX
  return (
    <Container className="mt-5 mb-5">
      <Card>
        <Card.Header as="h5">User Details</Card.Header>
        <Card.Body>
          {user.user ? (
            <div>
              <Card.Text>First Name: {user.user.first_name}</Card.Text>
              <Card.Text>Last Name: {user.user.last_name}</Card.Text>
              <Card.Text>Email: {user.user.email}</Card.Text>
              <Card.Text>
                Date Joined: {parseDate(user.user.date_joined)}
              </Card.Text>
            </div>
          ) : (
            <Card.Text>{user.error}</Card.Text>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserPage;
