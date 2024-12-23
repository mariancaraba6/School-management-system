import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import NavBar from "./NavBar";
import GradesSection from "./GradesSection";

const StudentDashboard = (props) => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // const handleLogout = () => {
  //   // Clear the session storage and navigate to login page
  //   sessionStorage.removeItem("token");
  //   navigate("/login");
  // };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Navigation Bar */}
      <NavBar
        tabIndex={tabIndex}
        handleTabChange={handleTabChange}
        onLogout={props.onLogout}
      />

      {/* Main Content */}
      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        {tabIndex === 0 && (
          <Box>
            <Typography variant="h4" gutterBottom color="primary">
              Grades
            </Typography>
            <GradesSection
              courses={[
                {
                  courseName: "Mathematics",
                  courseCode: "MATH101",
                  finalGrade: "9.5",
                  absences: ["2024-01-15", "2024-02-12"],
                },
                {
                  courseName: "Physics",
                  courseCode: "PHYS201",
                  finalGrade: "8.7",
                  absences: ["2024-01-10"],
                },
              ]}
            />
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Typography variant="h4" gutterBottom color="secondary">
              Absences
            </Typography>
            {/* Absences content goes here */}
          </Box>
        )}

        {tabIndex === 2 && (
          <Box>
            <Typography variant="h4" gutterBottom color="textSecondary">
              Personal Details
            </Typography>
            {/* Personal details content goes here */}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default StudentDashboard;
