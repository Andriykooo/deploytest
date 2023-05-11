import React from "react";
import { useNavigate } from "react-router-dom";
import { images } from "../../utils/imagesConstant";

export const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <div className=" goBackStyle">
      <img
        src={images.goBackArrow}
        alt="Go back"
        className="goBackArrow"
        onClick={() => navigate("/profile")}
      />
      <p className="goBack" onClick={() => navigate("/profile")}>
        Go Back
      </p>
    </div>
  );
};
