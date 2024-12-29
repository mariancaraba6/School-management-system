import React, { useRef, useState } from "react";
import { verifyOTPRequest } from "../../api/login";

const VerifyOTP = ({ goBack, successfulSettingup }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const verifyOTP = async (e) => {
    e.preventDefault();
    const otp = inputRef.current.value;
    try {
      const response = await verifyOTPRequest(otp);
      const data = await response.json();
      console.log("Data: ", data);
      console.log("Response: ", response);
      if (response.status === 200) {
        if (successfulSettingup) {
          successfulSettingup();
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
