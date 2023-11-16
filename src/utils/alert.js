"use client";

import Image from "next/image";
import { toast } from "react-toastify";
import { images } from "./imagesConstant";
import { CloseIcon, ToastError, ToastSuccess } from "./icons";

export const alertToast = ({
  message,
  autoClose = 4000,
  onClose = () => {},
}) => {
  toast.error(message, {
    icon: () => (
      <ToastError />
    ),
    position: "top-right",
    autoClose,
    onClose,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
};

export const SuccesToast = ({
  message,
  autoClose = 4000,
  onClose = () => {},
}) => {
  toast.success(message, {
    icon: () => (
      <ToastSuccess />
    ),
    position: "top-right",
    onClose,
    autoClose,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
};
// Close button customized for toast error
export const CloseButton = ({ closeToast }) => (
  <span className="Toastify__close-button" onClick={closeToast}>
    <CloseIcon />
  </span>
);
