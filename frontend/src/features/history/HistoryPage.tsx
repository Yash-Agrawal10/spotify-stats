import React, { useState, useEffect } from "react";
import { Container, Card, Row, Button, Table } from "react-bootstrap";
import { loadData } from "../../app/state/sessionStorage";
import api, { processError } from "../../app/api/api";

// Interfaces
interface HistoryItem {
  song: string;
  album: string;
  artists: string[];
  played_at: string;
}

const UserPage: React.FC = () => {
  // Local State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<null | string>(null);

  // Handlers
  const fetchHistory = async () => {
    try {
      const headers = { Authorization: `Bearer ${loadData("access_token")}` };
      const response = await api.get("/history/get/", { headers });
      if (response.status === 200) {
        setHistory(response.data);
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
      <Row>
        <Card>
          <Card.Body>
            <Card.Title>Spotify History</Card.Title>
            <Card.Text>
              This page displays the history of songs you have listened to on
              Spotify.
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>
      <Row className="mt-3">
        {error ? (
          <p>{error}</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Song</th>
                <th>Album</th>
                <th>Artists</th>
                <th>Played At</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>{item.song}</td>
                  <td>{item.album}</td>
                  <td>{item.artists.join(", ")}</td>
                  <td>{new Date(item.played_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Row>
      <Row className="mt-3">
        <Button
          variant="primary"
          onClick={(e) => {
            e.preventDefault();
            handleUpdateHistory();
          }}
        >
          Update History
        </Button>
      </Row>
    </Container>
  );
};

export default UserPage;
