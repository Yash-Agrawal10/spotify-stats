import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  ButtonGroup,
  Dropdown,
} from "react-bootstrap";
import { loadData } from "../../app/state/sessionStorage";
import api, { processError } from "../../app/api/api";
import HistoryTable from "./HistoryTable";

const HistoryPage: React.FC = () => {
  // (will be automated on launch)
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
  };

  // Local State
  const [currentDisplay, setCurrentDisplay] = useState<
    "history" | "tracks" | "artists" | "albums"
  >("history");
  const [itemCount, setItemCount] = useState<number>(10);
  const [startDate, setStartDate] = useState<string>("--");
  const [endDate, setEndDate] = useState<string>("--");
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Event Handlers
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    setCurrentDisplay(
      target.name as "history" | "tracks" | "artists" | "albums"
    );
    setStartDate("--");
    setEndDate("--");
  };

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${loadData("access_token")}` };
        const params = {
          type: currentDisplay,
          limit: itemCount,
          start: startDate,
          end: endDate,
        };
        const response = await api.get("/history/get/", { headers, params });
        if (response.status === 200) {
          setData(response.data);
          setError(null);
        }
      } catch (error) {
        const errorMessage: string = processError(error);
        setError(errorMessage);
      }
    };
    fetchData();
  }, [currentDisplay, itemCount, startDate, endDate]);

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
              name="history"
              variant={currentDisplay == "history" ? "primary" : "secondary"}
              onClick={handleClick}
            >
              History
            </Button>
            <Button
              name="tracks"
              variant={currentDisplay == "tracks" ? "primary" : "secondary"}
              onClick={handleClick}
            >
              Top Tracks
            </Button>
            <Button
              name="artists"
              variant={currentDisplay == "artists" ? "primary" : "secondary"}
              onClick={handleClick}
            >
              Top Artists
            </Button>
            <Button
              name="albums"
              variant={currentDisplay == "albums" ? "primary" : "secondary"}
              onClick={handleClick}
            >
              Top Albums
            </Button>
          </ButtonGroup>
        </Col>
        <Col xs="auto">
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="success" id="dropdown-item-count">
              Display {itemCount} Items
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {[5, 10, 20, 50].map((number) => (
                <Dropdown.Item
                  key={number}
                  onClick={() => setItemCount(number)}
                >
                  {number}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          {(error && <p>{error}</p>) || (
            <HistoryTable data={data} currentDisplay={currentDisplay} />
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
