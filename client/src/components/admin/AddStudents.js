import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";

const AddStudents = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    student_id: "",
    class_name: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.student_id ||
      !formData.class_name ||
      !formData.password
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      // Simulate API request to add student
      console.log("Submitting student data:", formData);

      // Reset form after successful submission
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        student_id: "",
        class_name: "",
        password: "",
      });
      setSuccessMessage("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
      setErrorMessage("Failed to add student. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography
          variant="h5"
          align="center"
          color="secondary"
          sx={{ marginBottom: 3, fontWeight: "bold" }}
        >
          Add New Student
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Student ID"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Class Name"
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                helperText="Set a password for the student"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                type="submit"
                sx={{ marginTop: 2 }}
              >
                Add Student
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar for Success */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>

      {/* Snackbar for Error */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AddStudents;
