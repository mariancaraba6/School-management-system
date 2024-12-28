import React from "react";
import { AppBar, Tabs, Tab, Box, IconButton, Tooltip } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatIcon from "@mui/icons-material/Chat";

const NavBar = ({ tabIndex, handleTabChange, onLogout }) => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#800020", // Burgundy color
        borderRadius: 2, // Rounded corners
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Modern shadow
        marginBottom: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          centered
          sx={{
            flexGrow: 1,
            "& .MuiTab-root": {
              color: "white", // Default text color for tabs
            },
            "& .Mui-selected": {
              color: "#FFD700", // Gold color for the selected tab
              fontWeight: "bold", // Make the selected tab stand out
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#FFD700", // Gold underline for the active tab
            },
          }}
        >
          <Tab
            icon={<AssignmentIcon />}
            label="My courses"
            sx={{ textTransform: "none", fontSize: "1rem" }}
          />
          <Tab
            icon={<SchoolIcon />}
            label="Manage Grades"
            sx={{ textTransform: "none", fontSize: "1rem" }}
          />
          <Tab
            icon={<SchoolIcon />}
            label="Manage Attendance"
            sx={{ textTransform: "none", fontSize: "1rem" }}
          />
          <Tab
            icon={<ChatIcon />}
            label="Chat"
            sx={{ textTransform: "none", fontSize: "1rem" }}
          />
          <Tab
            icon={<PersonIcon />}
            label="Personal Details"
            sx={{ textTransform: "none", fontSize: "1rem" }}
          />
        </Tabs>

        {/* Logout Button */}
        <Tooltip title="Logout">
          <IconButton onClick={onLogout} sx={{ color: "white" }}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </AppBar>
  );
};

export default NavBar;
