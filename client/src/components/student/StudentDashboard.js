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
import SetupOTP from "./SetupOTP";
import { enableTwoFactorAuthRequest } from "../../api/login";
import VerifyOTP from "./VerifyOTP";

const StudentDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();
  const [settingOTP, setSettingOTP] = useState(null);
  const [verifyOTP, setVerifyOTP] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    return navigate("/login");
  };

  const enableTwoFactorAuth = async () => {
    try {
      const response = await enableTwoFactorAuthRequest();
      if (response.status === 200) {
        const data = await response.json();
        console.log("Data: ", data);
        setSettingOTP(data);
      }
    } catch (error) {
      console.error("Error enabling two factor auth: ", error);
    }
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
              {!studentData && <LoadingPage />}
              {verifyOTP && (
                <VerifyOTP
                  goBack={() => setVerifyOTP(false)}
                  successfulSettingUp={() => {
                    fetchStudentData();
                    setSettingOTP(null);
                    setVerifyOTP(false);
                  }}
                />
              )}
              {!verifyOTP && studentData["details"] && settingOTP && (
                <SetupOTP
                  secret={settingOTP["secret"]}
                  qr_image={settingOTP["qr_image"]}
                  verifyOTP={() => setVerifyOTP(true)}
                />
              )}
              {!verifyOTP && studentData["details"] && !settingOTP && (
                <>
                  {studentData["details"]["image_path"] && (
                    <img
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #ccc",
                      }}
                      src={studentData["details"]["image_path"]}
                    />
                  )}
                  <p>Class: {studentData["details"].class_name}</p>
                  <p>Student ID: {studentData["details"].student_id}</p>
                  <p>
                    Name:{" "}
                    {studentData["details"].first_name +
                      " " +
                      studentData["details"].last_name}
                  </p>
                  <p>Email: {studentData["details"].email}</p>
                  {studentData["details"]
                    .is_two_factor_authentication_enabled && (
                    <p>Two Factor Authentication is enabled!</p>
                  )}
                  {!studentData["details"]
                    .is_two_factor_authentication_enabled && (
                    <button onClick={() => enableTwoFactorAuth()}>
                      {" "}
                      Enable Two Factor Authentication
                    </button>
                  )}
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
