import { useState } from "react";
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import "../styles/Table.css";

const Table = ({ data, columns, currentPage, pageSize }) => {
  const [statusFilter, setStatusFilter] = useState(null);
  const [issuanceTypeFilter, setIssuanceTypeFilter] = useState(null);

  const toggleFilter = (filterType) => {
    if (filterType === "status") {
      setStatusFilter((prev) =>
        prev === "Returned" ? "Pending" : prev === "Pending" ? null : "Returned"
      );
    } else if (filterType === "issuance_type") {
      setIssuanceTypeFilter((prev) =>
        prev === "In House" ? "Library" : prev === "Library" ? null : "In House"
      );
    }
  };

  const filteredData = data.filter((row) => {
    const matchesStatus = statusFilter ? row.status === statusFilter : true;
    const matchesIssuanceType = issuanceTypeFilter
      ? row.issuance_type === issuanceTypeFilter
      : true;
    return matchesStatus && matchesIssuanceType;
  });

  const renderIcon = (filterType) => {
    if (filterType === "status") {
      if (statusFilter === "Returned") {
        return <FaSortUp className="react-icon" />;
      } else if (statusFilter === "Pending") {
        return <FaSortDown className="react-icon" />;
      }
    } else if (filterType === "issuance_type") {
      if (issuanceTypeFilter === "In House") {
        return <FaSortUp className="react-icon" />;
      } else if (issuanceTypeFilter === "Library") {
        return <FaSortDown className="react-icon" />;
      }
    }
    return <FaSort className="react-icon default" />;
  };
  
  

  return (
    <div className="custom-table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                onClick={() => {
                  if (column.accessor === "status") toggleFilter("status");
                  if (column.accessor === "issuance_type") toggleFilter("issuance_type");
                }}
                style={{ cursor: "pointer" }} // Show pointer cursor to indicate clickable columns
              >
                {column.header}
                {column.accessor === "status" && renderIcon("status")}
                {column.accessor === "issuance_type" && renderIcon("issuance_type")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.accessor === "serialNo"
                    ? currentPage * pageSize + rowIndex + 1 // Calculate serial number based on page
                    : column.render
                    ? column.render(row)
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
