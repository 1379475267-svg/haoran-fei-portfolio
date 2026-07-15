import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../tokens.css";
import "./styles/globals.css";
import "./styles/soft-portfolio.css";
import "./styles/v3-portfolio.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
