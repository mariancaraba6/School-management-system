import { CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

const LoadingPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        height: "100vh",
      }}
    >
      <div style={{ width: "100vh", display: "flex", flexDirection: "column" }}>
        <CircularProgress style={{ alignSelf: "center", color: "black" }} />
        <Typography style={{ alignSelf: "center", color: "black" }}>
          {"Loading..."}
        </Typography>
      </div>
    </div>
  );
};

export default LoadingPage;
