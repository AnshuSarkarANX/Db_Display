import { useApiCall } from "../ApiHooks";

const Bottom = () => {
  const { loading, data, error, callApi } = useApiCall();
const flattenData = (apiData) => {
  if (!apiData || !apiData.content || !Array.isArray(apiData.content)) {
    return [];
  }

  const flattened = [];

  // Loop through each item in the content array
  apiData.content.forEach((item) => {
    const introductionId = item._id;

    // Process contactInfo array only if it exists and has items
    if (
      item.contactInfo &&
      Array.isArray(item.contactInfo) &&
      item.contactInfo.length > 0
    ) {
      item.contactInfo.forEach((contactItem) => {
        flattened.push({
          introductionId: introductionId,
          type: "contact",
          heading: contactItem.text || "",
          buttonText: contactItem.buttonText || "",
          buttonLink: null,
          contactList:
            contactItem.contact && Array.isArray(contactItem.contact)
              ? contactItem.contact.join(" ")
              : null,
          createdAt: "",
          updatedAt: "",
          status: 1,
        });
      });
    }

    // Process link array only if it exists and has items
    if (item.link && Array.isArray(item.link) && item.link.length > 0) {
      item.link.forEach((linkItem) => {
        flattened.push({
          introductionId: introductionId,
          type: "link",
          heading: linkItem.text || "",
          buttonText: linkItem.buttonText || "",
          buttonLink: linkItem.url || "",
          contactList: null,
          createdAt: "",
          updatedAt: "",
          status: 1,
        });
      });
    }
  });

  return flattened;
};

// Convert to CSV and download
const exportToCSV = () => {
  const tableData = flattenData(data);
  if (tableData.length === 0) return;

  const headers = [
    "introductionId",
    "type",
    "heading",
    "buttonText",
    "buttonLink",
    "contactList",
    "createdAt",
    "updatedAt",
    "status",
  ];

  const csvRows = [
    headers.join(","),
    ...tableData.map((row) =>
      headers
        .map((header) => {
          const value = row[header];

          // Handle null values
          if (value === null) return '""';

          let cleanValue = String(value);

          // Optional: Convert space-separated to comma-separated for CSV
          if (header === "contactList" && value) {
            cleanValue = value.replace(/ /g, ",");
          }

          return `"${cleanValue.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ];

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `contact_link_data_${Date.now()}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const tableData = data ? flattenData(data) : [];

return (
  <div>
    <h2>Contact & Links</h2>

    {loading && <p>Loading...</p>}
    {error && <p style={{ color: "red" }}>Error: {error}</p>}

    <div style={{ marginBottom: "10px" }}>
      <button
        onClick={() =>
          callApi(`/static-content/migration/introduction/bottom`)
        }
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
              <th>Type</th>
              <th>Heading</th>
              <th>Button Text</th>
              <th>Button Link</th>
              <th>Contact List</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={`${row.introductionId}-${row.type}-${index}`}>
                <td>{row.introductionId}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      
                      fontWeight: "bold",
                    }}
                  >
                    {row.type}
                  </span>
                </td>
                <td>{row.heading}</td>
                <td>{row.buttonText}</td>
                <td style={{ wordBreak: "break-all", maxWidth: "200px" }}>
                  {row.buttonLink || "-"}
                </td>
                <td style={{ wordBreak: "break-all", maxWidth: "300px" }}>
                  {row.contactList || "-"}
                </td>
                <td>{row.createdAt || "-"}</td>
                <td>{row.updatedAt || "-"}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {data && tableData.length === 0 && (
      <p>No contact or link data available to display.</p>
    )}
  </div>
);
};


export default Bottom;
