import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import StudentDashboard from "./components/student/StudentDashboard";

function App() {
  const [loggedIn, setLoggedIn] = React.useState(() => {
    return Boolean(sessionStorage.getItem("token"));
  });

  const handleLogout = () => {
    console.log("Logging out..."); // Debugging log
    sessionStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage setLoggedIn={setLoggedIn} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            loggedIn ? (
              <StudentDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
