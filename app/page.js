"use client";
import { useEffect, useState, useRef } from "react";

function Spreadsheet() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [visibleRows, setVisibleRows] = useState(20); // Start with 20 rows
  const [visibleCols, setVisibleCols] = useState(20); // Start with 20 columns
  const containerRef = useRef(null);

  const totalRows = 1000; // Total number of rows to load
  const rowBatchSize = 20; // Number of rows to load per batch

  useEffect(() => {
    // Initialize data with visible rows and columns
    const initialData = Array.from({ length: visibleRows }, () =>
      Array(visibleCols).fill("")
    );
    setData(initialData);
  }, [visibleRows, visibleCols]);

  const loadMoreRows = () => {
    if (visibleRows < totalRows) {
      const newRows = Array.from({ length: rowBatchSize }, () =>
        Array(visibleCols).fill("")
      );
      setData((prevData) => [...prevData, ...newRows]);
      setVisibleRows((prev) => prev + rowBatchSize);
    }
  };

  const loadMoreCols = () => {
    const newCols = data.map((row) => [...row, ...Array(20).fill("")]);
    setData(newCols);
    setVisibleCols((prev) => prev + 20);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    // Trigger load more rows slightly earlier (10px from the bottom)
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
      loadMoreRows();
    }
    // Trigger load more columns slightly earlier (10px from the right edge)
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
      loadMoreCols();
    }
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = data.map((row, i) =>
      i === rowIndex ? row.map((cell, j) => (j === colIndex ? value : cell)) : row
    );
    setData(newData);
    handleSearch(searchQuery, newData); // Update search results if search query is active
  };

  const handleSearch = (query, dataToSearch) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = [];
    dataToSearch.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.toLowerCase().includes(query.toLowerCase())) {
          results.push({ rowIndex, colIndex });
        }
      });
    });

    setSearchResults(results);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (data) {
      handleSearch(query, data);
    }
  };

  const isHighlighted = (rowIndex, colIndex) => {
    return searchResults.some(
      (result) => result.rowIndex === rowIndex && result.colIndex === colIndex
    );
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="m-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ maxHeight: "80vh", overflow: "auto" }}
      >
        <table className="border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              {Array(visibleCols+1)
                .fill("")
                .map((item, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-gray-700 bg-gray-100"
                  >
                    {index === 0 ? "" : `Column ${index}`}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-gray-700">
                  {rowIndex + 1}
                </td>
                {row.map((cell, colIndex) => (
                  <td
                    style={{ minWidth: 200 }}
                    key={colIndex}
                    className={`border border-gray-300 ${
                      isHighlighted(rowIndex, colIndex) ? "bg-red-200" : ""
                    }`}
                  >
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      className="w-full px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Spreadsheet;
