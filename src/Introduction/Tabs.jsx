import { useApiCall } from "../ApiHooks";

const Tabs = () => {
  const { loading, data , error, callApi } = useApiCall();
  // Add this to see what the API actually returns

  // Flatten the nested data structure
  const flattenData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    const flattened = [];

    apiData.forEach((item) => {
      if (!item.tabs || item.tabs.length === 0) return;

      item.tabs.forEach((tab) => {
        flattened.push({
          introductionid: item._id,
          heading: tab.heading,
          description: tab.description.replace(/<[^>]*>/g, ""), // Strip HTML tags
          iconid: tab.icon,
          iconbutton: tab.redirectIcon,
          iconbuttonlink: tab.redirectLink,
          linktype: tab.type,
          createdAt: "",
          updatedAt: "",
          status: 1,
        });
      });
    });

    return flattened;
  };

  // Convert to CSV and download
  const exportToCSV = () => {
    const tableData = flattenData(data?.content);
    if (tableData.length === 0) return;

    // Create CSV header
    const headers = [
      "introductionid",
      "heading",
      "description",
      "iconid",
      "iconbutton",
      "iconbuttonlink",
      "linktype",
      "createdAt",
      "updatedAt",
      "status",
    ];

    // Create CSV rows
    const csvRows = [
      headers.join(","), // Header row
      ...tableData.map((row) =>
        headers
          .map((header) => {
            const value = row[header] || "";
            // Escape commas and quotes in values
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    // Create blob and download
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `tabs_data_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tableData = data?.content ? flattenData(data?.content) : [];

  return (
    <div>
      <h2>Tabs</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => callApi(`/static-content/migration/introduction/tabs`)}
          disabled={loading}
        >
          Call API
        </button>

        {tableData.length > 0 && (
          <button onClick={exportToCSV} style={{ marginLeft: "10px" }}>
            Export to CSV
          </button>
        )}
      </div>

      {tableData.length > 0 && (
        <div style={{ marginTop: "20px", overflowX: "auto" }}>
          <table
            border="1"
            cellPadding="8"
            cellSpacing="0"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th>Introduction ID</th>
                <th>Heading</th>
                <th>Description</th>
                <th>Icon ID</th>
                <th>Icon Button</th>
                <th>Icon Button Link</th>
                <th>Link Type</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={`${row.introductionid}-${index}`}>
                  <td>{row.introductionid}</td>
                  <td>{row.heading}</td>
                  <td dangerouslySetInnerHTML={{ __html: row.description }} />
                  <td>{row.iconid}</td>
                  <td>{row.iconbutton}</td>
                  <td style={{ wordBreak: "break-all", maxWidth: "200px" }}>
                    {row.iconbuttonlink}
                  </td>
                  <td>{row.linktype}</td>
                  <td>{row.createdAt}</td>
                  <td>{row.updatedAt}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.content && tableData.length === 0 && (
        <p>No tabs data available to display.</p>
      )}
    </div>
  );
};

export default Tabs;
