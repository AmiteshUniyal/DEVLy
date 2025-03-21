import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom"; // Change here
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/contextapi";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <HashRouter> {/* Change BrowserRouter → HashRouter */}
        <App />
      </HashRouter>
    </AppProvider>
  </StrictMode>
);