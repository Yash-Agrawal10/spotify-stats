// src/components/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import { Container, Card, Row, Button } from "react-bootstrap";
import { loadData } from "../../app/state/sessionStorage";
import api, { processError } from "../../app/api/api";

const UserPage: React.FC = () => {
  // Local State
  const [history, setHistory] = useState([]);
  const [error, setError] = useState<null | string>(null);

  // Handlers
  const fetchHistory = async () => {
    try {
      const headers = { Authorization: `Bearer ${loadData("access_token")}` };
      const response = await api.get("/history/", { headers });
      if (response.status === 200) {
        setHistory(response.data);
        setError(null);
      }
    } catch (error) {
      const errorMessage: string = processError(error);
      setError(errorMessage);
    }
  };

  const handleUpdateHistory = async () => {
    try {
      const headers = { Authorization: `Bearer ${loadData("access_token")}` };
      const response = await api.post("/history/update/", {}, { headers });
      if (response.status === 200) {
        setError(null);
      }
    } catch (error) {
      const errorMessage: string = processError(error);
      setError(errorMessage);
    }
    if (!error) fetchHistory();
  };

  // Effects
  useEffect(() => {
    fetchHistory();
  }, []);

  // JSX
  return (
    <Container className="mt-5">
      <Row className="mt-3">
        <Card>
          <Card.Header as="h5">History Page</Card.Header>
          <Card.Body>{history}</Card.Body>
        </Card>
      </Row>
      <Row className="mt-3">
        <Button variant="primary" onClick={handleUpdateHistory}>
          Update History
        </Button>
      </Row>
    </Container>
  );
};

export default UserPage;
