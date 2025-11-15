import { useApiCall } from "../ApiHooks";

const UserMenu = () => {
  const { loading, data, error, callApi } = useApiCall();

  // Flatten both quickLinks and menu arrays into table rows
  const flattenData = (apiData) => {
    if (!apiData || !apiData.content) {
      return [];
    }

    const flattened = [];
    const content = apiData.content;

    // Process quickLinks array
    if (
      content.quickLinks &&
      Array.isArray(content.quickLinks) &&
      content.quickLinks.length > 0
    ) {
      content.quickLinks.forEach((item) => {
        flattened.push({
          id: item._id,
          communityid: "687736b188db8c898ef099fd",
          communitymemberid: "68787d48f957eee8d21f5937",
          type: "quick-link",
          icon: item.icon?.svg || null,
          activeColor: item.icon?.activeColor || null,
          link: item.path || null,
          heading: item.title || null,
          description: null,
          usercategory:
            item.userCategoryId && Array.isArray(item.userCategoryId)
              ? item.userCategoryId.join(" ")
              : null,
          usercategoryignore: null,
          order_no: item.order || null,
          show_sort: null,
          show_filter: null,
          show_search: null,
          show_subMenu: 0,
          subMenu_link: 0,
          show_addbutton: 0,
          addbutton_link: 0,
          show_download_button: 0,
          status: item.status !== undefined ? item.status : 1,
        });
      });
    }

    // Process menu array
    if (
      content.menu &&
      Array.isArray(content.menu) &&
      content.menu.length > 0
    ) {
      content.menu.forEach((item) => {
        flattened.push({
          id: item._id,
          communityid: "687736b188db8c898ef099fd",
          communitymemberid: "68787d48f957eee8d21f5937",
          type: "menu",
          icon: item.icon?.svg || null,
          activeColor: item.icon?.activeColor || null,
          link: item.path || null,
          heading: item.title || null,
          description: null,
          usercategory:
            item.userCategoryId && Array.isArray(item.userCategoryId)
              ? item.userCategoryId.join(" ")
              : null,
          usercategoryignore: null,
          order_no: item.order || null,
          show_sort: item.isShowSort ? 1 : 0,
          show_filter: item.isShowFilter ? 1 : 0,
          show_search: item.isShowSearch ? 1 : 0,
          show_subMenu: 0,
          subMenu_link: 0,
          show_addbutton: 0,
          addbutton_link: 0,
          show_download_button: 0,
          status: item.status !== undefined ? item.status : 1,
        });
      });
    }

    return flattened;
  };

  // Convert to CSV and download
  const exportToCSV = () => {
    const tableData = flattenData(data);
    if (tableData.length === 0) return;

    const headers = [
      "id",
      "communityid",
      "communitymemberid",
      "type",
      "icon",
      "activeColor",
      "link",
      "heading",
      "description",
      "usercategory",
      "usercategoryignore",
      "order_no",
      "show_sort",
      "show_filter",
      "show_search",
      "show_subMenu",
      "subMenu_link",
      "show_addbutton",
      "addbutton_link",
      "show_download_button",
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

            // Convert space-separated to comma-separated for usercategory in CSV
            if (header === "usercategory" && value) {
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
    link.setAttribute("download", `user_menu_data_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tableData = data ? flattenData(data) : [];

  return (
    <div>
      <h2>User Menu</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => callApi(`/layout/migration/menu_user`)}
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
            style={{ width: "100%", fontSize: "12px" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Community ID</th>
                <th>Community Member ID</th>
                <th>Type</th>
                <th>Icon</th>
                <th>Active Color</th>
                <th>Link</th>
                <th>Heading</th>
                <th>Description</th>
                <th>User Category</th>
                <th>User Category Ignore</th>
                <th>Order No</th>
                <th>Show Sort</th>
                <th>Show Filter</th>
                <th>Show Search</th>
                <th>Show SubMenu</th>
                <th>SubMenu Link</th>
                <th>Show Add Button</th>
                <th>Add Button Link</th>
                <th>Show Download Button</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={`${row.id}-${index}`}>
                  <td>{row.id}</td>
                  <td>{row.communityid}</td>
                  <td>{row.communitymemberid}</td>
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
                  <td>{row.icon || "-"}</td>
                  <td>{row.activeColor || "-"}</td>
                  <td style={{ wordBreak: "break-all", maxWidth: "200px" }}>
                    {row.link || "-"}
                  </td>
                  <td>{row.heading || "-"}</td>
                  <td>{row.description || "-"}</td>
                  <td style={{ wordBreak: "break-all", maxWidth: "200px" }}>
                    {row.usercategory || "-"}
                  </td>
                  <td>{row.usercategoryignore || "-"}</td>
                  <td>{row.order_no}</td>
                  <td>{row.show_sort !== null ? row.show_sort : "-"}</td>
                  <td>{row.show_filter !== null ? row.show_filter : "-"}</td>
                  <td>{row.show_search !== null ? row.show_search : "-"}</td>
                  <td>{row.show_subMenu}</td>
                  <td>{row.subMenu_link}</td>
                  <td>{row.show_addbutton}</td>
                  <td>{row.addbutton_link}</td>
                  <td>{row.show_download_button}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && tableData.length === 0 && (
        <p>No menu data available to display.</p>
      )}
    </div>
  );
};

export default UserMenu;
