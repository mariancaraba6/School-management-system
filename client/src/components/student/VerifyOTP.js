import React, { useRef, useState } from "react";
import { verifyOTPRequest } from "../../api/login";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const VerifyOTP = ({ goBack, successfulSettingup }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const verifyOTP = async (e) => {
    e.preventDefault();
    const otp = inputRef.current.value;
    try {
      const response = await verifyOTPRequest(otp);
      const data = await response.json();
      console.log("Data: ", data);
      console.log("Response: ", response);
      if (response.status === 200) {
        if (successfulSettingup) {
          successfulSettingup();
          return;
        }
      }
    } catch (error) {
      console.error("Error verifying OTP: ", error);
      setError("Error verifying OTP. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "400px",
        margin: "auto",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Verify OTP
      </Typography>
      <form onSubmit={verifyOTP} style={{ width: "100%" }}>
        <Stack spacing={2}>
          <TextField
            inputRef={inputRef}
            type="text"
            label="Enter OTP"
            placeholder="123456"
            fullWidth
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: "10px 20px",
              borderRadius: "20px",
              textTransform: "none",
              backgroundColor: "#008060",
              marginTop: 2,
              "&:hover": { backgroundColor: "#600080" },
            }}
          >
            Verify
          </Button>
        </Stack>
      </form>
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      {goBack && (
        <Button
          onClick={goBack}
          variant="contained"
          color="secondary"
          sx={{ marginTop: "2", borderRadius: "20px" }}
        >
          Go Back
        </Button>
      )}
    </Box>
  );
};

export default VerifyOTP;
