import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  ButtonGroup,
  Table,
} from "react-bootstrap";
import { loadData } from "../../app/state/sessionStorage";
import api, { processError } from "../../app/api/api";

// Interfaces
interface HistoryItem {
  track: string;
  album: string;
  artists: string[];
  played_at: string;
}

interface TopItem {
  name: string;
  streams: number;
}

const HistoryPage: React.FC = () => {
  // Local State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [topArtists, setTopArtists] = useState<TopItem[]>([]);
  const [topTracks, setTopTracks] = useState<TopItem[]>([]);
  const [topAlbums, setTopAlbums] = useState<TopItem[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState<
    "history" | "tracks" | "artists" | "albums"
  >("history");
  const [error, setError] = useState<string | null>(null);

  // Event Handlers
  const fetchHistory = async () => {
    try {
      const headers = { Authorization: `Bearer ${loadData("access_token")}` };
      const response = await api.get("/history/history/", { headers });
      if (response.status === 200) {
        setHistory(response.data);
      }
    } catch (error) {
      const errorMessage: string = processError(error);
      setError(errorMessage);
    }
  };

  const fetchTop = async () => {
    try {
      const headers = { Authorization: `Bearer ${loadData("access_token")}` };
      const response = await api.get("/history/top/", { headers });
      if (response.status === 200) {
        setTopArtists(response.data.artists);
        setTopTracks(response.data.tracks);
        setTopAlbums(response.data.albums);
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
    if (!error) {
      fetchHistory();
      fetchTop();
    }
  };

  // Effects
  useEffect(() => {
    setError(null);
    fetchHistory();
    fetchTop();
  }, []);

  // Helpers
  function formatDateTime(datetime: string): string {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    const dateObj = new Date(datetime);
    return new Intl.DateTimeFormat("en-US", options).format(dateObj);
  }

  // JSX
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Spotify History</Card.Title>
              <Card.Text>
                This page displays information about your Spotify listening
                history.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <ButtonGroup>
            <Button
              variant={currentDisplay == "history" ? "primary" : "secondary"}
              onClick={() => setCurrentDisplay("history")}
            >
              History
            </Button>
            <Button
              variant={currentDisplay == "tracks" ? "primary" : "secondary"}
              onClick={() => setCurrentDisplay("tracks")}
            >
              Top Tracks
            </Button>
            <Button
              variant={currentDisplay == "artists" ? "primary" : "secondary"}
              onClick={() => setCurrentDisplay("artists")}
            >
              Top Artists
            </Button>
            <Button
              variant={currentDisplay == "albums" ? "primary" : "secondary"}
              onClick={() => setCurrentDisplay("albums")}
            >
              Top Albums
            </Button>
          </ButtonGroup>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          {error ? (
            <p>{error}</p>
          ) : (
            (currentDisplay === "history" && (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Track</th>
                    <th>Album</th>
                    <th>Artists</th>
                    <th>Played At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index}>
                      <td>{item.track}</td>
                      <td>{item.album}</td>
                      <td>{item.artists.join(", ")}</td>
                      <td>{formatDateTime(item.played_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )) ||
            (currentDisplay === "tracks" && (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Track</th>
                    <th>Streams</th>
                  </tr>
                </thead>
                <tbody>
                  {topTracks.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.streams}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )) ||
            (currentDisplay === "artists" && (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Artist</th>
                    <th>Streams</th>
                  </tr>
                </thead>
                <tbody>
                  {topArtists.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.streams}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )) ||
            (currentDisplay === "albums" && (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Album</th>
                    <th>Streams</th>
                  </tr>
                </thead>
                <tbody>
                  {topAlbums.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.streams}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ))
          )}
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Button variant="primary" onClick={handleUpdateHistory}>
            Update History
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HistoryPage;
