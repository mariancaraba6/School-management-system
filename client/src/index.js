import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import "./index.css";
import App from "./App";

const modernTheme = createTheme({
  palette: {
    mode: "light", // Use 'dark' for a dark theme
    primary: {
      main: "#1976d2", // Blue
    },
    secondary: {
      main: "#800020", // burgundy
    },
    compl: {
      main: "#008060", // green
    },
    background: {
      default: "#f5f5f5", // Light gray background
      paper: "#ffffff", // White card backgrounds
    },
    text: {
      primary: "#333333", // Darker text for contrast
      secondary: "#666666", // Lighter text for secondary content
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif", // Use modern Google Font like Poppins
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "none", // No uppercase buttons
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners for buttons, cards, etc.
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounder buttons
          textTransform: "none", // Disable all caps
          padding: "8px 16px", // Padding for a sleek button
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for cards
          borderRadius: 12,
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={modernTheme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>
);
