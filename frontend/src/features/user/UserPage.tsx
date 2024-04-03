// src/components/DashboardPage.tsx
import React, { useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/state/hooks";
import { selectAuth } from "../auth/authSlice";
import { selectUser } from "./userSlice";
import { fetchUser } from "./userSlice";
import { loadData } from "../../app/state/localStorage";

const UserPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (auth.isLoggedIn) {
      const token = loadData("access_token");
      console.log("Token: ", token);
      if (token) {
        dispatch(fetchUser(token));
      }
    }
  }, [auth.isLoggedIn, dispatch]);

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
