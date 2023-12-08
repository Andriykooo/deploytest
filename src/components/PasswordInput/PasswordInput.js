import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { useState } from "react";
import classNames from "classnames";
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
      <Image
        onClick={() => {
          setShowPassword(!showPassword);
        }}
        src={showPassword ? images.showPassIcon : images.hidePassword}
        className="showPasswordIcon"
        alt="Valid"
        width={24}
        height={24}
      />
    </div>
  );
};
