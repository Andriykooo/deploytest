import React from "react";

export const Button = ({ className, text, onClick, disabled, id }) => {
  return (
    <button className={className} onClick={onClick} disabled={disabled} id={id}>
      {text}
    </button>
  );
};
