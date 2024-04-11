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
import { selectHistory } from "./historySlice";

// Interfaces
interface TableColumn {
  key: string;
  label: string;
}

// Constants
const historyHeaders: TableColumn[] = [
  { key: "track", label: "Track" },
  { key: "album", label: "Album" },
  { key: "artists", label: "Artists" },
  { key: "played_at", label: "Played At" },
];
const topTrackHeaders: TableColumn[] = [
  { key: "name", label: "Track" },
  { key: "artists", label: "Artists" },
  { key: "streams", label: "Streams" },
];
const topArtistHeaders: TableColumn[] = [
  { key: "name", label: "Artist" },
  { key: "streams", label: "Streams" },
];
const topAlbumHeaders: TableColumn[] = [
  { key: "name", label: "Album" },
  { key: "artists", label: "Artists" },
  { key: "streams", label: "Streams" },
];

const HistoryPage: React.FC = () => {
  // Redux State
  const dispatch = useAppDispatch();
  const history = useAppSelector((state) => selectHistory(state).history);
  const topTracks = useAppSelector((state) => selectHistory(state).topTracks);
  const topArtists = useAppSelector((state) => selectHistory(state).topArtists);
  const topAlbums = useAppSelector((state) => selectHistory(state).topAlbums);

  // Local State
  const [currentDisplay, setCurrentDisplay] = useState<
    "history" | "tracks" | "artists" | "albums"
  >("history");
  const [error, setError] = useState<string | null>(null);

  // Session Storage
  const accessToken: string = loadData("access_token");

  // Event Handlers (handleUpdateHistory will be automated on launch)
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
      dispatch(fetchHistory(accessToken));
      dispatch(fetchTop(accessToken));
    }
  };

  // Effects
  useEffect(() => {
    setError(null);
    dispatch(fetchHistory(accessToken));
    dispatch(fetchTop(accessToken));
  }, [dispatch]);

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
          {(error && <p>{error}</p>) ||
            (currentDisplay === "history" && (
              <HistoryTable data={history} headers={historyHeaders} />
            )) ||
            (currentDisplay === "tracks" && (
              <HistoryTable data={topTracks} headers={topTrackHeaders} />
            )) ||
            (currentDisplay === "artists" && (
              <HistoryTable data={topArtists} headers={topArtistHeaders} />
            )) ||
            (currentDisplay === "albums" && (
              <HistoryTable data={topAlbums} headers={topAlbumHeaders} />
            ))}
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
