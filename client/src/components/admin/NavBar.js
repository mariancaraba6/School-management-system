import React from "react";
import { AppBar, Tabs, Tab, Box, IconButton, Tooltip } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";

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
            icon={<SchoolIcon />}
            label="Add Students"
            sx={{ textTransform: "none", fontSize: "1rem" }}
          />
          <Tab
            icon={<PersonIcon />}
            label="Add Professors"
            sx={{ textTransform: "none", fontSize: "1rem" }}
          />
          <Tab
            icon={<AddIcon />}
            label="Add Courses"
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
