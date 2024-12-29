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
import { addCourseRequest } from "../../api/admin";

const AddCourses = () => {
  const [formData, setFormData] = useState({
    course_id: "",
    professor_id: "",
    course_name: "",
    course_description: "",
    course_credits: "",
    grade_components: [],
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGradeComponentChange = (index, field, value) => {
    const validatedValue =
      field === "weight"
        ? Math.min(Math.max(parseInt(value) || 0, 0), 100)
        : value;

    const updatedComponents = [...formData.grade_components];
    updatedComponents[index][field] = validatedValue;
    setFormData({ ...formData, grade_components: updatedComponents });
  };

  const addGradeComponent = () => {
    setFormData({
      ...formData,
      grade_components: [
        ...formData.grade_components,
        { name: "", weight: "" },
      ],
    });
  };

  const removeGradeComponent = (index) => {
    const updatedComponents = formData.grade_components.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, grade_components: updatedComponents });
  };

  const calculateTotalWeight = () =>
    formData.grade_components.reduce(
      (total, component) => total + parseInt(component.weight || 0),
      0
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.course_id ||
      !formData.professor_id ||
      !formData.course_name ||
      !formData.course_description ||
      !formData.course_credits ||
      formData.grade_components.length === 0
    ) {
      setErrorMessage(
        "Please fill in all fields and add at least one grade component."
      );
      return;
    }

    const totalWeight = calculateTotalWeight();
    if (totalWeight !== 100) {
      setErrorMessage("The total weight of grade components must equal 100%.");
      return;
    }

    try {
      console.log("Submitting course data:", formData);
      const response = await addCourseRequest(formData);
      if (response.status >= 400 && response.status < 600) {
        const error = await response.json();
        setErrorMessage(error.error);
        return;
      }
      if (response.status >= 200 && response.status < 300) {
        // Reset form after successful submission
        setFormData({
          course_id: "",
          professor_id: "",
          course_name: "",
          course_description: "",
          course_credits: "",
          grade_components: [],
        });
        setSuccessMessage("Course added successfully!");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      setErrorMessage("Failed to add course. Please try again.");
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
          Add New Course
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course ID"
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Professor ID"
                name="professor_id"
                value={formData.professor_id}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Name"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Description"
                name="course_description"
                value={formData.course_description}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Credits"
                name="course_credits"
                type="number"
                value={formData.course_credits}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" color="secondary" gutterBottom>
                Grade Components
              </Typography>
              {formData.grade_components.map((component, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{ marginBottom: 1, alignItems: "center" }} // Align items in the center
                >
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Component Name"
                      value={component.name}
                      onChange={(e) =>
                        handleGradeComponentChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Weight (%)"
                      type="number"
                      value={component.weight}
                      onChange={(e) =>
                        handleGradeComponentChange(
                          index,
                          "weight",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => removeGradeComponent(index)}
                      fullWidth
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                color="secondary"
                onClick={addGradeComponent}
                sx={{ marginTop: 1 }}
              >
                Add Component
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body2"
                color={
                  calculateTotalWeight() === 100 ? "success.main" : "error.main"
                }
              >
                Total Weight: {calculateTotalWeight()}%
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                type="submit"
                sx={{ marginTop: 2 }}
              >
                Add Course
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

export default AddCourses;
