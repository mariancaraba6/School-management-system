import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper } from "@mui/material";
import NavBar from "./NavBar";
import Courses from "./Courses";
import Enrolment from "./Enrolment";
import {
  getAllCoursesRequest,
  getDetailsRequest,
  getGradesRequest,
} from "../../api/student";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import LoadingPage from "../../LoadingPage";

const StudentDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    return navigate("/login");
  };

  const fetchStudentData = useCallback(async () => {
    setStudentData(null);
    try {
      const studentDetailsResponse = await getDetailsRequest();
      const studentGradesResponse = await getGradesRequest();
      const studentCoursesResponse = await getAllCoursesRequest();

      if (
        studentDetailsResponse.status !== 200 ||
        studentGradesResponse.status !== 200 ||
        studentCoursesResponse.status !== 200
      ) {
        throw new Error(
          `Stauts getting details: ${studentDetailsResponse.status}, 
            getting grades: ${studentGradesResponse.status}, getting courses: ${studentCoursesResponse.status}.`
        );
      }

      const studentDetailsData = await studentDetailsResponse.json();
      console.log("Details: ", studentDetailsData);

      const studentGradesData = await studentGradesResponse.json();
      console.log("Grades: ", studentGradesData);

      const studentCoursesData = await studentCoursesResponse.json();
      console.log("Courses: ", studentCoursesData);

      setStudentData({
        details: studentDetailsData,
        grades: studentGradesData["courses"],
        courses: studentCoursesData["courses"],
      });
    } catch (error) {
      console.error("Error getting grades: ", error);
      logout();
    }
  }, []);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <NavBar
        tabIndex={tabIndex}
        handleTabChange={handleTabChange}
        onLogout={logout}
      />

      {!studentData && <LoadingPage />}
      {studentData && (
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
              <Courses courses={studentData["grades"]} />
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
                Enrolment
              </Typography>
              <Enrolment
                courses={studentData["courses"]}
                enroled={studentData["grades"].map(
                  (course) => course.courseCode
                )}
                reload={fetchStudentData}
              />
            </Box>
          )}

          {tabIndex === 2 && <Chat />}

          {tabIndex === 3 && (
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                Personal Details
              </Typography>
              {studentData["details"] && (
                <>
                  <img
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #ccc",
                    }}
                    src="https://scontent.ftsr1-2.fna.fbcdn.net/v/t39.30808-6/463085582_2806213079547883_1965533098475735546_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=qnCKNoaHNhMQ7kNvgFeIF7w&_nc_zt=23&_nc_ht=scontent.ftsr1-2.fna&_nc_gid=AJsGGMh0ghDNusCmXhieuMb&oh=00_AYAG2yTZKUDpDZFuCklfMYoxcR1DWm-D3O3fPYe9xtbZDA&oe=67763254"
                  />
                  <p>Class: {studentData["details"].class_name}</p>
                  <p>Student ID: {studentData["details"].student_id}</p>
                  <p>
                    Name:{" "}
                    {studentData["details"].first_name +
                      " " +
                      studentData["details"].last_name}
                  </p>
                  <p>Email: {studentData["details"].email}</p>
                </>
              )}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default StudentDashboard;
