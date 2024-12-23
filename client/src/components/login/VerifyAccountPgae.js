import { verifyAccountRequest } from "../../api/login";
import LoadingPage from "../../LoadingPage";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const VerifyAccountPage = () => {
  const [content, setContent] = useState(<LoadingPage />);
  const navigate = useNavigate();
  const location = useLocation();

  const verifyToken = useCallback(async () => {
    try {
      const response = await verifyAccountRequest();
      if (response.status !== 200) {
        throw new Error(`Status: ${response.status}.`);
      }
      const data = await response.json();
      console.log("Data: ", data);
      const role = data.role;
      console.log(location.pathname);
      if (location.pathname === "/" || location.pathname === "") {
        navigate(`/${role}-dashboard`);
      }
      setContent(<Outlet />);
      return;
    } catch (error) {
      console.error("Error verifying account: ", error);
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return content;
};

export default VerifyAccountPage;
