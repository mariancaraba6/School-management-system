import React, { useRef, useState } from "react";
import { verifyLoginOTPRequest, verifySetupOTPRequest } from "../../api/login";

const VerifyOTP = ({ goBack, successfulSettingUp, successfulLogingPage }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const verifyOTP = async (e) => {
    e.preventDefault();
    const otp = inputRef.current.value;
    try {
      if (successfulSettingUp) {
        const response = await verifySetupOTPRequest(otp);
        console.log("Response: ", response);
        const data = await response.json();
        console.log("Data: ", data);
        if (response.status === 200) {
          successfulSettingUp();
          return;
        }
      }
      if (successfulLogingPage) {
        const response = await verifyLoginOTPRequest(
          otp,
          successfulLogingPage.temp_token
        );
        console.log("Response: ", response);
        const data = await response.json();
        console.log("Data: ", data);
        if (response.status === 200) {
          successfulLogingPage.next(data.token);
          return;
        }
      }
    } catch (error) {
      console.error("Error verifying OTP: ", error);
      setError("Error verifying OTP. Please try again.");
    }
  };

  return (
    <div>
      <h1>Verify OTP</h1>
      <form>
        <input ref={inputRef} type="text" placeholder="Enter OTP" />
        <button type="submit" onClick={verifyOTP}>
          Verify
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {goBack && <button onClick={goBack}>Go Back</button>}
    </div>
  );
};

export default VerifyOTP;
