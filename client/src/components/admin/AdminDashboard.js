import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

const ProfessorDashboard = () => {
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
            <Typography variant="h4" gutterBottom color="primary">
              My Courses
            </Typography>
            {/* <MyCourses /> */}
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Typography variant="h4" gutterBottom color="primary">
              Manage Grades
            </Typography>
            {/* <ManageGrades /> */}
          </Box>
        )}

        {tabIndex === 2 && (
          <Box>
            <Typography variant="h4" gutterBottom color="secondary">
              Manage Attendance
            </Typography>
            {/* <ManageAttendance /> */}
          </Box>
        )}

        {tabIndex === 3 && (
          <Box>
            <Typography variant="h4" gutterBottom color="secondary">
              Personal Details
            </Typography>
            <Typography variant="body1">
              <p>Name: John Doe</p>
              <p>Email: johndoe@example.com</p>
              <p>Subject: Mathematics</p>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProfessorDashboard;
