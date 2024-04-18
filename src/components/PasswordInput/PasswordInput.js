import classNames from "classnames";
import { useState } from "react";
import { PasswordIcon } from "@/icons/PasswordIcon";
import "./PasswordInput.css";

export const PasswordInput = ({ value, onChange, placeholder, autoFocus }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-container">
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        className={classNames("password_input", {
          active: value?.length > 0 && !showPassword,
        })}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
      {value?.length > 0 && (
        <PasswordIcon
          onClick={() => {
            setShowPassword(!showPassword);
          }}
          className="showPasswordIcon"
          show={showPassword}
        />
      )}
    </div>
  );
};
