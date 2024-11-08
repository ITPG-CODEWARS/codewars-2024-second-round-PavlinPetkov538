import React, { useEffect, useState } from "react";

interface UrlsDisplayModel {
  id: number;
  longUrl?: string;
  shortenedUrl?: string;
  validUntil: string; // assuming it's in ISO format
  validClicks: number;
  password?: string;
  clicks: number;
}

const MyUrls: React.FC = () => {
  const [urls, setUrls] = useState<UrlsDisplayModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState<UrlsDisplayModel | null>(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/UrlShortner/Mine",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Add token to Authorization header
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch URLs. Please try again.");
        }

        const data: UrlsDisplayModel[] = await response.json();
        setUrls(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "An error occurred.");
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchUrls();
  }, []);

  // Helper function to check if the date is the default date (01/01/1)
  const isDefaultDate = (date: string): boolean => {
    return date == "01/01/1";
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/UrlShortner/Delete?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setUrls(urls.filter((url) => url.id !== id)); // Remove the deleted URL from the state
      } else {
        setError("Failed to delete URL. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while deleting the URL.");
    }
  };

  const handleEdit = (url: UrlsDisplayModel) => {
    setEditingUrl(url);
  };

  const handleSaveEdit = async () => {
    if (!editingUrl) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/UrlShortner/Edit",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Id: editingUrl.id,
            LongUrl: editingUrl.longUrl,
            ValidUntil: editingUrl.validUntil,
            ValidClicks: editingUrl.validClicks,
            Password: editingUrl.password,
          }),
        }
      );

      if (response.ok) {
        setUrls((prevUrls) =>
          prevUrls.map((u) => (u.id === editingUrl.id ? editingUrl : u))
        );
        setEditingUrl(null); // Close the edit form
      } else {
        setError("Failed to edit URL. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while editing the URL.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>
        Your Shortened URLs
      </h1>

      {error && (
        <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          {error}
        </p>
      )}

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <th style={{ padding: "10px", textAlign: "left" }}>Long URL</th>
            <th style={{ padding: "10px", textAlign: "left" }}>
              Shortened URL
            </th>
            <th style={{ padding: "10px", textAlign: "left" }}>Valid Until</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Valid Clicks</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Password</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Clicks</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                No URLs found.
              </td>
            </tr>
          ) : (
            urls.map((url) => (
              <tr key={url.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{url.longUrl}</td>
                <td style={{ padding: "10px" }}>
                  <a
                    href={url.shortenedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1E90FF", textDecoration: "none" }}
                  >
                    {url.shortenedUrl}
                  </a>
                </td>
                <td style={{ padding: "10px" }}>
                  {isDefaultDate(
                    new Date(url.validUntil).toLocaleDateString("en-GB")
                  )
                    ? "N/A"
                    : new Date(url.validUntil).toLocaleDateString("en-GB")}
                </td>
                <td style={{ padding: "10px" }}>
                  {url.validClicks === -1 ? "N/A" : url.validClicks}
                </td>
                <td style={{ padding: "10px" }}>{url.password || "N/A"}</td>
                <td style={{ padding: "10px" }}>{url.clicks}</td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => handleEdit(url)}
                    style={{
                      marginRight: "10px",
                      padding: "5px 10px",
                      backgroundColor: "#FFA500",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(url.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#FF0000",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2>Edit URL</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}
          >
            <div>
              <label>
                Long URL:
                <input
                  type="text"
                  value={editingUrl.longUrl || ""}
                  onChange={(e) =>
                    setEditingUrl((prev) => ({
                      ...prev!,
                      longUrl: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
            <div>
              <label>
                Valid Until:
                <input
                  type="date"
                  value={editingUrl.validUntil.split("T")[0]}
                  onChange={(e) =>
                    setEditingUrl((prev) => ({
                      ...prev!,
                      validUntil: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
            <div>
              <label>
                Valid Clicks:
                <input
                  type="number"
                  value={editingUrl.validClicks}
                  onChange={(e) =>
                    setEditingUrl((prev) => ({
                      ...prev!,
                      validClicks: parseInt(e.target.value),
                    }))
                  }
                />
              </label>
            </div>
            <div>
              <label>
                Password:
                <input
                  type="text"
                  value={editingUrl.password || ""}
                  onChange={(e) =>
                    setEditingUrl((prev) => ({
                      ...prev!,
                      password: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
            <div>
              <button type="submit">Save</button>
              <button
                type="button"
                onClick={() => setEditingUrl(null)}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyUrls;
