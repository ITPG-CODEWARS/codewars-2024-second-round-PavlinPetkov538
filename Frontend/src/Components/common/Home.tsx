import React, { useState } from "react";
import "./Home.css";

// Define a type for the form data
interface FormData {
  longUrl: string;
  isCustom: boolean;
  custom: string;
  length: number;
  customDate: boolean;
  validUntil: string;
  hasValidClicks: boolean;
  validClicks: number;
  password: string;
}

function Home() {
  const [formData, setFormData] = useState<FormData>({
    longUrl: "",
    isCustom: false,
    custom: "",
    length: 8,
    customDate: false,
    validUntil: "",
    hasValidClicks: false,
    validClicks: 0,
    password: "",
  });
  const [responseMessage, setResponseMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const dataToSend = {
      LongUrl: formData.longUrl || null, // Ensure that all fields default to null if not filled
      IsCustom: formData.isCustom,
      Custom: formData.isCustom && formData.custom ? formData.custom : null,
      Length: formData.length || null,
      CustomDate: formData.customDate,
      ValidUntil: formData.customDate ? formData.validUntil || null : null,
      HasValidClicks: formData.hasValidClicks,
      ValidClicks: formData.hasValidClicks
        ? formData.validClicks || null
        : null,
      Password: formData.password || null,
    };

    console.log("Data to send:", dataToSend); // Check the data to ensure it's correctly set

    try {
      const response = await fetch(
        "http://localhost:5000/api/UrlShortner/Add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Make sure headers are correct
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend), // Convert to JSON before sending
        }
      );

      if (response.ok) {
        setResponseMessage("URL shortened successfully!");
      } else {
        setResponseMessage("Failed to shorten URL.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponseMessage("An error occurred while shortening the URL.");
    }
  };

  return (
    <div className="container">
      <form id="url-form" onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="longUrl"
          value={formData.longUrl}
          placeholder="Enter URL to shorten"
          required
          onChange={handleChange}
          className="input"
        />

        <div className="form-group">
          <input
            type="checkbox"
            name="isCustom"
            checked={formData.isCustom}
            onChange={handleChange}
          />
          <label>Use custom URL</label>
          <input
            type="text"
            name="custom"
            value={formData.custom}
            placeholder="Custom URL suffix"
            onChange={handleChange}
            disabled={!formData.isCustom}
            className="input"
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            name="length"
            value={formData.length}
            placeholder="Length of shortened URL"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="form-group">
          <input
            type="checkbox"
            name="customDate"
            checked={formData.customDate}
            onChange={handleChange}
          />
          <label>Set expiration date</label>
          <input
            type="date"
            name="validUntil"
            value={formData.validUntil}
            onChange={handleChange}
            disabled={!formData.customDate}
            className="input"
          />
        </div>

        <div className="form-group">
          <input
            type="checkbox"
            name="hasValidClicks"
            checked={formData.hasValidClicks}
            onChange={handleChange}
          />
          <label>Enable click limit</label>
          <input
            type="number"
            name="validClicks"
            value={formData.validClicks}
            placeholder="Valid click limit"
            onChange={handleChange}
            disabled={!formData.hasValidClicks}
            className="input"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password for access (optional)"
            onChange={handleChange}
            className="input"
          />
        </div>

        <button type="submit" className="submit-button">
          Shorten URL
        </button>
      </form>

      {responseMessage && <div className="result">{responseMessage}</div>}
    </div>
  );
}

export default Home;
