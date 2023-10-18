"use client";

import Image from "next/image";
import { toast } from "react-toastify";
import { images } from "./imagesConstant";

export const alertToast = ({
  message,
  autoClose = 4000,
  onClose = () => {},
}) => {
  toast.error(message, {
    icon: () => (
      <Image
        alt="img-toastError"
        className="customIcon"
        src={images.toastError}
      />
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
      <Image
        alt="img-toastSuccess"
        className="customIcon2"
        src={images.toastSuccess}
      />
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
    <Image alt="img-closeIcon" src={images.closeIcon} />
  </span>
);
