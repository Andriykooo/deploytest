import React from "react";

export const Button = ({ type, className, text, onClick, disabled, id }) => {
  return (
    <button
      type={type || "button"}
      className={className}
      onClick={onClick}
      disabled={disabled}
      id={id}
    >
      {text}
    </button>
  );
};
