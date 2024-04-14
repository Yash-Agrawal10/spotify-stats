import React, { useEffect } from "react";
import api, { processError } from "../../app/api/api";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { loadData } from "../../app/state/sessionStorage";
import { useAppSelector, useAppDispatch } from "../../app/state/hooks";
import { getHistory, selectHistory } from "./historySlice";
import HistoryTable from "./HistoryTable";
import HistoryTypes from "./HistoryTypes";
import HistoryLimit from "./HistoryLimit";
import HistoryDates from "./HistoryDates";

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

  // Effects
  useEffect(() => {
    dispatch(getHistory({ type, limit, start, end }));
  }, []);

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

      <Container fluid>
        <Row className="mt-3 d-flex align-items-center justify-content-around">
          <Col xl={4} lg={4} md={6} sm={12} className="mb-3">
            <HistoryTypes />
          </Col>
          <Col xl={3} lg={3} md={6} sm={12} xs="auto" className="mb-3">
            <HistoryLimit />
          </Col>
          <Col xl={4} lg={4} md={6} sm={12} xs="auto" className="mb-3">
            <HistoryDates />
          </Col>
        </Row>
      </Container>

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
