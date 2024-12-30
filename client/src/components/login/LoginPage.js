import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { loginRequest } from "../../api/login";
import { setToken } from "../../api/utils";
import { useNavigate } from "react-router-dom";
import VerifyOTP from "../student/VerifyOTP";

export default function LoginPage() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [accountError, setAccountError] = React.useState(false);
  const [accountErrorMessage, setAccountErrorMessage] = React.useState("");
  const [twoFactorAuth, setTwoFactorAuth] = React.useState(false);
  const navigate = useNavigate();

  const sendLoginRequest = async (email, password) => {
    try {
      const response = await loginRequest(email, password);
      if (response.status === 200) {
        console.log("Login successful!");
        const data = await response.json();
        console.log("Data: ", data);
        if ("token" in data) {
          const token = data.token;
          setToken(token);
          setAccountError(false);
          setAccountErrorMessage("");
          return navigate("/");
        }
        setTwoFactorAuth({ temp_token: data.temp_token });
      }
      setAccountError(true);
      setAccountErrorMessage("Invalid email or password.");
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (emailError || passwordError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    sendLoginRequest(data.get("email"), data.get("password"));
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  if (twoFactorAuth) {
    return (
      <VerifyOTP
        goBack={() => setTwoFactorAuth(false)}
        successfulLogingPage={{
          temp_token: twoFactorAuth.temp_token,
          next: (token) => {
            setToken(token);
            return navigate("/");
          },
        }}
      />
    );
  }

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      style={{ padding: "2rem" }}
    >
      <MuiCard
        variant="outlined"
        style={{
          maxWidth: "450px",
          padding: "1rem",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
          width: "100%",
          gap: "1rem",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
          }}
        >
          Log in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? "error" : "secondary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "secondary"}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
            color="secondary"
          >
            Sign in
          </Button>
          {accountError && (
            <Typography color="error" style={{ margin: "auto" }}>
              {accountErrorMessage}
            </Typography>
          )}
        </Box>
      </MuiCard>
    </Stack>
  );
}
