import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/state/hooks";
import { getHistory } from "./historySlice";

const HistoryDates: React.FC = () => {
  // Redux State
  const { limit, type, start, end } = useAppSelector(
    (state) => state.history.params
  );
  const dispatch = useAppDispatch();

  // Local State for input fields
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  // Event Handlers
  const handleStartDateChange = (e:any) => {
    const selectedDate = e.target.value;
    setStartDate(selectedDate);
    if (endDate && selectedDate > endDate) {
        setEndDate('');
        dispatch(getHistory({ start: selectedDate, end: '', limit, type }));
    }
    else{
        dispatch(getHistory({ start: selectedDate, end: endDate, limit, type }));
    }
};

const handleEndDateChange = (e:any) => {
    const selectedDate = e.target.value;
    setEndDate(selectedDate);
    if (startDate && selectedDate < startDate) {
        setStartDate('');
        dispatch(getHistory({ start: '', end: selectedDate, limit, type }));
    }
    else{
        dispatch(getHistory({ start: startDate, end: selectedDate, limit, type }));
    }
};

  return (
    <Form>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={(e) => handleStartDateChange(e)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={(e) => handleEndDateChange(e)}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default HistoryDates;
