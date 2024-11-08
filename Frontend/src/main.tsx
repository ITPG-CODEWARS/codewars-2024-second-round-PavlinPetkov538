import React from "react";
import ReactDOM from "react-dom/client";
import Navigation from "./Components/common/Navigation";
import App from "./Components/common/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Navigation />
    <App />
  </React.StrictMode>
);
