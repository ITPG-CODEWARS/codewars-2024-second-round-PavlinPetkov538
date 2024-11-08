import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface OpenUrlResponse {
  url?: string;
  Result?: string;
}

const OpenUrlComponent: React.FC = () => {
  const { suffix } = useParams<{ suffix: string }>();
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [passwordNeeded, setPasswordNeeded] = useState<boolean>(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (suffix) {
      fetchUrl();
    }
  }, [suffix]);

  const fetchUrl = async () => {
    setError(null);
    setPasswordNeeded(false);

    try {
      const response = await fetch(
        `http://localhost:5000/api/UrlShortner/Open?suffix=${encodeURIComponent(
          suffix ?? ""
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "GET",
        }
      );

      if (response.status === 401) {
        setPasswordNeeded(true);
        setError("Password required");
        return;
      }

      const data = await response.json();

      if (data.result !== "Ok") {
        setError(data.Result!);
      } else {
        console.log(data.url);
        setRedirectUrl(data.url);
      }
    } catch (err) {
      setError("Network error, please try again later");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchUrl();
  };

  useEffect(() => {
    if (redirectUrl) {
      // Use window.location.assign for immediate navigation
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  return (
    <div>
      <h2>Open Shortened URL</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {passwordNeeded && (
        <form onSubmit={handlePasswordSubmit}>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit Password</button>
        </form>
      )}
    </div>
  );
};

export default OpenUrlComponent;
