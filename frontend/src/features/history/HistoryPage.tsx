import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import { loadData } from "../../app/state/sessionStorage";
import api, { processError } from "../../app/api/api";
import { useAppDispatch, useAppSelector } from "../../app/state/hooks";
import { fetchHistory, fetchTop } from "./historySlice";
import HistoryTable from "./HistoryTable";

// Interfaces
interface TableColumn {
  key: string;
  label: string;
}

const HistoryPage: React.FC = () => {
  // Redux State
  const dispatch = useAppDispatch();

  // Local State
  const [headers, setHeaders] = useState<TableColumn[]>([
    { key: "track", label: "Track" },
    { key: "album", label: "Album" },
    { key: "artists", label: "Artists" },
    { key: "played_at", label: "Played At" },
  ]);
  const [data, setData] = useState<any[]>(
    useAppSelector((state) => state.history.history)
  );
  const [currentDisplay, setCurrentDisplay] = useState<
    "history" | "tracks" | "artists" | "albums"
  >("history");
  const [error, setError] = useState<string | null>(null);

  // Event Handlers
  const getHistory = () => {
    const accessToken: string = loadData("access_token");
    dispatch(fetchHistory(accessToken));
  };

  const getTop = async () => {
    const accessToken = loadData("access_token");
    dispatch(fetchTop(accessToken));
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
      getHistory();
      getTop();
    }
  };

  // Effects
  useEffect(() => {
    setError(null);
    getHistory();
    getTop();
  }, []);

  useEffect(() => {
    switch (currentDisplay) {
      case "history":
        setHeaders([
          { key: "track", label: "Track" },
          { key: "album", label: "Album" },
          { key: "artists", label: "Artists" },
          { key: "played_at", label: "Played At" },
        ]);
        setData(useAppSelector((state) => state.history.history));
        break;
      case "tracks":
        setHeaders([
          { key: "track", label: "Track" },
          { key: "artists", label: "Artists" },
          { key: "streams", label: "Streams" },
        ]);
        setData(useAppSelector((state) => state.history.topTracks));
        break;
      case "artists":
        setHeaders([
          { key: "artist", label: "Artist" },
          { key: "streams", label: "Streams" },
        ]);
        setData(useAppSelector((state) => state.history.topArtists));
        break;
      case "albums":
        setHeaders([
          { key: "album", label: "Album" },
          { key: "artists", label: "Artists" },
          { key: "streams", label: "Streams" },
        ]);
        setData(useAppSelector((state) => state.history.topAlbums));
        break;
    }
  }, [currentDisplay]);

  // JSX
  return (
    <Container className="my-5">
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
            <HistoryTable headers={headers} data={data} />
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
