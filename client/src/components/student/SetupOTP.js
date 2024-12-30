import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

const SetupOTP = ({ secret, qr_image, verifyOTP }) => {
  return (
    <Box
      sx={{
        maxWidth: "550px",
        margin: "auto",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" component="h1">
        Setup Google Authenticator
      </Typography>
      <Typography variant="body1" gutterBottom>
        Follow the instructions below to set up your Google Authenticator.
      </Typography>

      <Stack spacing={2} divider={<Divider flexItem />}>
        <Typography variant="body2">
          1. Download
          <Link
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
            target="_blank"
            rel="noopener"
            sx={{ marginLeft: "5px" }}
          >
            Google Authenticator
          </Link>{" "}
          on your mobile.
        </Typography>

        <Typography variant="body2">2. Set up a new authenticator.</Typography>

        <Typography variant="body2">
          3. Once you have scanned the QR code below, please click
          <Button
            size="small"
            onClick={verifyOTP}
            sx={{ textTransform: "none" }}
          >
            Verify
          </Button>
          once ready.
        </Typography>
      </Stack>

      <Box>
        <img
          src={`data:image/png;base64, ${qr_image}`}
          alt="Secret Token QR"
          style={{ width: "250px", height: "250px", objectFit: "contain" }}
        />
      </Box>

      <Box sx={{ marginTop: "1rem" }}>
        <TextField
          label="Secret Token"
          value={secret}
          InputProps={{ readOnly: true }}
          variant="outlined"
          fullWidth
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
          onClick={() => navigator.clipboard.writeText(secret)}
        >
          Copy Secret
        </Button>
      </Box>
    </Box>
  );
};

export default SetupOTP;
