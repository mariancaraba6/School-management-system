import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import NavBar from "./NavBar";
import GradesSection from "./GradesSection";
import { getDetailsRequest, getGradesRequest } from "../../api/student";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [grades, setGrades] = useState([]);
  const [studentDetails, setStudentDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    return navigate("/login");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const studentDetailsResponse = await getDetailsRequest();
        const studentGradesResponse = await getGradesRequest();

        if (
          studentDetailsResponse.status !== 200 ||
          studentGradesResponse.status !== 200
        ) {
          throw new Error(
            `Stauts getting details: ${studentDetailsResponse.status}, getting grades: ${studentGradesResponse.status}.`
          );
        }

        const studentDetailsData = await studentDetailsResponse.json();
        console.log("Details: ", studentDetailsData);
        setStudentDetails(studentDetailsData);

        const studentGradesData = await studentGradesResponse.json();
        console.log("Grades: ", studentGradesData);
        setGrades(studentGradesData["courses"]);

        setLoading(false);
      } catch (error) {
        console.error("Error getting grades: ", error);
        logout();
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Navigation Bar */}
      <NavBar
        tabIndex={tabIndex}
        handleTabChange={handleTabChange}
        onLogout={logout}
      />

      {/* Main Content */}
      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        {tabIndex === 0 && (
          <Box>
            <Typography variant="h4" gutterBottom color="primary">
              Courses
            </Typography>
            <GradesSection courses={grades} />
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Typography variant="h4" gutterBottom color="textSecondary">
              Personal Details
            </Typography>
            {studentDetails && (
              <>
                <p>Class: {studentDetails.class_name}</p>
                <p>Student ID: {studentDetails.student_id}</p>
                <p>
                  Name:{" "}
                  {studentDetails.first_name + " " + studentDetails.last_name}
                </p>
                <p>Email: {studentDetails.email}</p>
              </>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default StudentDashboard;
