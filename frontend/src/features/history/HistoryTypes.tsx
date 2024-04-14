import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/state/hooks";
import { getHistory } from "./historySlice";

const HistoryTypes: React.FC = () => {
  // Redux State
  const { limit, type, start, end } = useAppSelector(
    (state) => state.history.params
  );
  const dispatch = useAppDispatch();

  // Event Handlers
  const handleTypeChange = (event: React.MouseEvent<HTMLButtonElement>) => {
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
    <ButtonGroup>
      <Button
        name="history"
        variant={type == "history" ? "primary" : "secondary"}
        onClick={handleTypeChange}
      >
        History
      </Button>
      <Button
        name="tracks"
        variant={type == "tracks" ? "primary" : "secondary"}
        onClick={handleTypeChange}
      >
        Top Tracks
      </Button>
      <Button
        name="artists"
        variant={type == "artists" ? "primary" : "secondary"}
        onClick={handleTypeChange}
      >
        Top Artists
      </Button>
      <Button
        name="albums"
        variant={type == "albums" ? "primary" : "secondary"}
        onClick={handleTypeChange}
      >
        Top Albums
      </Button>
    </ButtonGroup>
  );
};

export default HistoryTypes;
