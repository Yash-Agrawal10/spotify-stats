import React from "react";
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
import { useAppSelector, useAppDispatch } from "../../app/state/hooks";
import { getHistory, selectHistory } from "./historySlice";

const HistoryPage: React.FC = () => {
  // (will be automated on launch)
  const handleUpdateHistory = async () => {
    try {
      const headers = { Authorization: `Bearer ${loadData("access_token")}` };
      const response = await api.post("/history/update/", {}, { headers });
      if (response.status === 200) {
        console.log("History updated successfully");
      }
    } catch (error) {
      const errorMessage: string = processError(error);
      console.log(errorMessage);
    }
  };

  // Redux State
  const error = useAppSelector((state) => selectHistory(state).error);
  const { type, limit, start, end } = useAppSelector(
    (state) => state.history.params
  );
  const dispatch = useAppDispatch();

  // Event Handlers
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (type === event.currentTarget.name) return;
    type ValidType = "history" | "albums" | "artists" | "tracks";
    const params = {
      type: event.currentTarget.name as ValidType,
      limit,
      start,
      end,
    };
    dispatch(getHistory(params));
  };

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
              variant={type == "history" ? "primary" : "secondary"}
              onClick={handleClick}
            >
              History
            </Button>
            <Button
              name="tracks"
              variant={type == "tracks" ? "primary" : "secondary"}
              onClick={handleClick}
            >
              Top Tracks
            </Button>
            <Button
              name="artists"
              variant={type == "artists" ? "primary" : "secondary"}
              onClick={handleClick}
            >
              Top Artists
            </Button>
            <Button
              name="albums"
              variant={type == "albums" ? "primary" : "secondary"}
              onClick={handleClick}
            >
              Top Albums
            </Button>
          </ButtonGroup>
        </Col>
        <Col xs="auto">
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="success" id="dropdown-item-count">
              Display {limit} Items
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {[5, 10, 20, 50].map((number) => (
                <Dropdown.Item
                  key={number}
                  onClick={() =>
                    dispatch(getHistory({ type, limit: number, start, end }))
                  }
                >
                  {number}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>{(error && <p>{error}</p>) || <HistoryTable />}</Col>
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
