import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import NavBar from "./NavBar";
import ManageGrades from "./ManageGrades";
import ManageAttendance from "./ManageAttendance";
import { useNavigate } from "react-router-dom";
import MyCourses from "./MyCourses";
import Chat from "./Chat";
import { getDetailsRequest, getGradesRequest } from "../../api/professor";
import LoadingPage from "../../LoadingPage";

const ProfessorDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();
  const [professorData, setProfessorData] = useState(null);

  const logout = () => {
    sessionStorage.removeItem("token");
    return navigate("/login");
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const fetchProfessorData = useCallback(async () => {
    setProfessorData(null);
    try {
      const professorDetailsResponse = await getDetailsRequest();
      const professorCoursesResponse = await getGradesRequest();

      if (
        professorDetailsResponse.status !== 200 ||
        professorCoursesResponse.status !== 200
      ) {
        throw new Error(
          `Stauts getting details: ${professorDetailsResponse.status}, getting grades: ${professorCoursesResponse.status}.`
        );
      }

      const professorDetailsData = await professorDetailsResponse.json();
      console.log("Details: ", professorDetailsData);

      const professorCoursesData = await professorCoursesResponse.json();
      console.log("Grades: ", professorCoursesData);

      setProfessorData({
        details: professorDetailsData,
        courses: professorCoursesData["courses"],
      });
    } catch (error) {
      console.error("Error getting grades: ", error);
      logout();
    }
  }, []);

  useEffect(() => {
    fetchProfessorData();
  }, [fetchProfessorData]);

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <NavBar
        tabIndex={tabIndex}
        handleTabChange={handleTabChange}
        onLogout={logout}
      />

      {!professorData && <LoadingPage />}

      {professorData && (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
          {tabIndex === 0 && (
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                color="secondary"
                sx={{ fontWeight: "bold" }}
              >
                My Courses
              </Typography>
              <MyCourses courses={professorData["courses"]} />
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
                Manage Grades
              </Typography>
              <ManageGrades courses={professorData["courses"]} />
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
                Manage Attendance
              </Typography>
              <ManageAttendance courses={professorData["courses"]} />
            </Box>
          )}

          {tabIndex === 3 && <Chat />}

          {tabIndex === 4 && (
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                color="secondary"
                sx={{ fontWeight: "bold" }}
              >
                Personal Details
              </Typography>
              {professorData["details"] && (
                <>
                  <p>
                    Professor ID: {professorData["details"]["professor_id"]}
                  </p>
                  <p>
                    Name:{" "}
                    {`${professorData["details"]["first_name"]} ${professorData["details"]["last_name"]}`}
                  </p>
                  <p>Email: {professorData["details"]["email"]}</p>
                </>
              )}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ProfessorDashboard;
