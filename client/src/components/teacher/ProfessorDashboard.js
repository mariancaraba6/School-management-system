import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import NavBar from "./NavBar";
import ManageGrades from "./ManageGrades";
import ManageAttendance from "./ManageAttendance";
import { useNavigate } from "react-router-dom";
import MyCourses from "./MyCourses";
import Chat from "./Chat";
import { getDetailsRequest, getGradesRequest } from "../../api/professor";
import LoadingPage from "../../LoadingPage";
import LinkIcon from "@mui/icons-material/Link";
import SetupOTP from "../student/SetupOTP";
import { enableTwoFactorAuthRequest } from "../../api/login";
import VerifyOTP from "../student/VerifyOTP";

const ProfessorDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();
  const [professorData, setProfessorData] = useState(null);
  const [settingOTP, setSettingOTP] = useState(null);
  const [verifyOTP, setVerifyOTP] = useState(false);

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
              <ManageAttendance />
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
              {!professorData && <LoadingPage />}
              {verifyOTP && (
                <VerifyOTP
                  goBack={() => setVerifyOTP(false)}
                  successfulSettingUp={() => {
                    fetchProfessorData();
                    setSettingOTP(null);
                    setVerifyOTP(false);
                  }}
                />
              )}
              {!verifyOTP && professorData["details"] && settingOTP && (
                <SetupOTP
                  secret={settingOTP["secret"]}
                  qr_image={settingOTP["qr_image"]}
                  verifyOTP={() => setVerifyOTP(true)}
                />
              )}
              {!verifyOTP && professorData["details"] && !settingOTP && (
                <>
                  {professorData["details"]["image_path"] && (
                    <img
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #ccc",
                      }}
                      src={professorData["details"]["image_path"]}
                    />
                  )}
                  <Typography variant="body1" sx={{ marginTop: 2 }}>
                    Professor ID: {professorData["details"]["professor_id"]}
                  </Typography>
                  <Typography variant="body1">
                    Name:{" "}
                    {`${professorData["details"]["first_name"]} ${professorData["details"]["last_name"]}`}
                  </Typography>
                  <Typography variant="body1">
                    Email: {professorData["details"]["email"]}
                  </Typography>
                  {professorData["details"]
                    .is_two_factor_authentication_enabled && (
                    <p>Two Factor Authentication is enabled!</p>
                  )}
                  {!professorData["details"]
                    .is_two_factor_authentication_enabled && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => enableTwoFactorAuth()}
                      startIcon={<LinkIcon />}
                      sx={{
                        padding: "10px 20px",
                        borderRadius: "20px",
                        textTransform: "none",
                        backgroundColor: "#008060",
                        marginTop: 2,
                        "&:hover": { backgroundColor: "#600080" },
                      }}
                    >
                      {" "}
                      Enable Two Factor Authentication
                    </Button>
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

export default ProfessorDashboard;
