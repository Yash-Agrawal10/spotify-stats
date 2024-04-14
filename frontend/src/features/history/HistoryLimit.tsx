import React from "react";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/state/hooks";
import { getHistory } from "./historySlice";

const HistoryLimit: React.FC = () => {
  // Redux State
  const { limit, type, start, end } = useAppSelector(
    (state) => state.history.params
  );
  const dispatch = useAppDispatch();

  // JSX
  return (
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
  );
};

export default HistoryLimit;
