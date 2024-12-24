import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import NavBar from "./NavBar";
import GradesManagementSection from "./GradesManagementSection";
import AttendanceSection from "./AttendanceSection";
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
              Manage Grades
            </Typography>
            <GradesManagementSection />
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Typography variant="h4" gutterBottom color="secondary">
              Manage Attendance
            </Typography>
            <AttendanceSection />
          </Box>
        )}

        {tabIndex === 2 && (
          <Box>
            <Typography variant="h4" gutterBottom color="textSecondary">
              Personal Details
            </Typography>
            <p>Name: John Doe</p>
            <p>Email: johndoe@example.com</p>
            <p>Subject: Mathematics</p>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProfessorDashboard;
