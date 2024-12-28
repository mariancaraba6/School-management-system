import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import AddCourses from "./AddCourses";
import AddProfessors from "./AddProfessors";
import AddStudents from "./AddStudents";

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("token");
    return navigate("/login");
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <NavBar
        tabIndex={tabIndex}
        handleTabChange={handleTabChange}
        onLogout={logout}
      />

      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        {tabIndex === 0 && (
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              color="secondary"
              sx={{ fontWeight: "bold" }}
            >
              Add Students
            </Typography>
            <AddStudents />
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              color="secondary"
              sx={{ fontWeight: "bold" }}
            >
              Add Professors
            </Typography>
            <AddProfessors />
          </Box>
        )}

        {tabIndex === 2 && (
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              color="secondary"
              sx={{ fontWeight: "bold" }}
            >
              Add Courses
            </Typography>
            <AddCourses />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
