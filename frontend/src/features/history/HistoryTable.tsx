import React from "react";
import { Table } from "react-bootstrap";
import { useAppSelector } from "../../app/state/hooks";

// Interfaces
export interface TableColumn {
  key: string;
  label: string;
  type: "string" | "number" | "date" | "array";
}
const getHeaders = (currentDisplay: string): TableColumn[] => {
  switch (currentDisplay) {
    case "history":
      return [
        { key: "track", label: "Track", type: "string" },
        { key: "album", label: "Album", type: "string" },
        { key: "artists", label: "Artists", type: "array" },
        { key: "played_at", label: "Played At", type: "date" },
      ];
    case "tracks":
      return [
        { key: "name", label: "Track", type: "string" },
        { key: "artists", label: "Artists", type: "array" },
        { key: "streams", label: "Streams", type: "number" },
      ];
    case "artists":
      return [
        { key: "name", label: "Artist", type: "string" },
        { key: "streams", label: "Streams", type: "number" },
      ];
    case "albums":
      return [
        { key: "name", label: "Album", type: "string" },
        { key: "artists", label: "Artists", type: "array" },
        { key: "streams", label: "Streams", type: "number" },
      ];
    default:
      return [];
  }
};

const HistoryTable: React.FC = () => {
  // Redux State
  const data = useAppSelector((state) => state.history.data);
  const type = useAppSelector((state) => state.history.params.type);

  // Helpers
  const defaultFormatter = (value: any, type: string) => {
    switch (type) {
      case "date":
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          };
          return new Intl.DateTimeFormat("en-US", options).format(date);
        }
        break;
      case "array":
        return value.join(", ");
      case "number":
        return value.toString();
      case "string":
        return value.toString();
      default:
        return value.toString();
    }
  };

  const headers = getHeaders(type);

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header.key}>{header.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header.key}>
                {defaultFormatter(item[header.key], header.type)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default HistoryTable;
