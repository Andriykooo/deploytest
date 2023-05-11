import { toast } from "react-toastify";
import { images } from "./imagesConstant";
import Image from "next/image";

export const alertToast = ({ message }) => {
  toast.error(message, {
    icon: () => (
      <Image
        alt="img-toastError"
        className="customIcon"
        src={images.toastError}
      />
    ),
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
};

export const SuccesToast = ({ message }) => {
  toast.success(message, {
    icon: () => (
      <Image
        alt="img-toastSuccess"
        className="customIcon2"
        src={images.toastSuccess}
      />
    ),
    position: "top-right",
    autoClose: 4000,
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
