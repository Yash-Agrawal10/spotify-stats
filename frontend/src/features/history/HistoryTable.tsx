import React from "react";
import { Table } from "react-bootstrap";

// Interfaces
export interface TableColumn {
  key: string;
  label: string;
  type: "string" | "number" | "date" | "array";
}

interface HistoryTableProps {
  headers: TableColumn[];
  data: any[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({
  headers,
  data,
}: HistoryTableProps) => {
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
