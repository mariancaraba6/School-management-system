import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import VerifyAccountPage from "./components/login/VerifyAccountPgae";
import StudentDashboard from "./components/student/StudentDashboard";
import ProfessorDashboard from "./components/teacher/ProfessorDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

const router = createBrowserRouter([
  {
    path: "",
    element: <VerifyAccountPage />,
    children: [
      {
        path: "student-dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "professor-dashboard",
        element: <ProfessorDashboard />,
      },
      {
        path: "admin-dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export default router;
