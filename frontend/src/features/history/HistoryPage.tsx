import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
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

const UserPage: React.FC = () => {
  // Local State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [topArtists, setTopArtists] = useState<TopItem[]>([]);
  const [topTracks, setTopTracks] = useState<TopItem[]>([]);
  const [topAlbums, setTopAlbums] = useState<TopItem[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState<
    "history" | "tracks" | "artists" | "albums"
  >("history");
  const [error, setError] = useState<null | string>(null);

  // Handlers
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
    if (!error) fetchHistory();
  };

  // Effects
  useEffect(() => {
    fetchHistory();
    fetchTop();
  }, []);

  // Helpers
  function formatDateTime(datetime: string): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long', // "January", "February", etc.
      day: 'numeric', // 1, 2, ..., 31
      year: 'numeric', // 2024
      hour: 'numeric', // 12-hour format
      minute: '2-digit', // 00, 01, ..., 59
      second: '2-digit', // 00, 01, ..., 59
      hour12: true // Use AM/PM
    };
    const dateObj = new Date(datetime);
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
  }
  

  // JSX
  return (
    <Container className="mt-5">
      <Row>
        <Card>
          <Card.Body>
            <Card.Title>Spotify History</Card.Title>
            <Card.Text>
              This page displays information about your Spotify listening
              history.
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>

      <Row className="mt-3">
        <ButtonGroup>
          <Button
            variant={currentDisplay == "history" ? "primary" : "secondary"}
            onClick={(e) => {
              e.preventDefault();
              setCurrentDisplay("history");
            }}
          >
            History
          </Button>

          <Button
            variant={currentDisplay == "tracks" ? "primary" : "secondary"}
            onClick={(e) => {
              e.preventDefault();
              setCurrentDisplay("tracks");
            }}
          >
            Top Tracks
          </Button>

          <Button
            variant={currentDisplay == "artists" ? "primary" : "secondary"}
            onClick={(e) => {
              e.preventDefault();
              setCurrentDisplay("artists");
            }}
          >
            Top Artists
          </Button>

          <Button
            variant={currentDisplay == "albums" ? "primary" : "secondary"}
            onClick={(e) => {
              e.preventDefault();
              setCurrentDisplay("albums");
            }}
          >
            Top Albums
          </Button>
        </ButtonGroup>
      </Row>

      <Row className="mt-3">
        {error ? (
          <p>{error}</p>
        ) : (
          (currentDisplay === "history" && (
            <Table striped bordered hover>
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
            <Table striped bordered hover>
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
            <Table striped bordered hover>
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
            <Table striped bordered hover>
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
