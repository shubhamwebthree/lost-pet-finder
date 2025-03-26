import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./components/context/AuthContext"; 
import "./index.scss";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <App />
    </AuthProvider>
);
