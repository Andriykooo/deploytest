import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import "./DatePicker.css";
import { useClickOutside } from "@/hooks/useClickOutside";

export const DatePicker = ({ value, onChange, placeholder }) => {
  const params = useParams();
  const datePickerRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  const close = () => {
    setIsActive(false);
  };

  const open = () => {
    setIsActive(true);
  };

  const toggle = () => {
    if (isActive) {
      close();
    } else {
      open();
    }
  };

  const hanldeChange = useCallback(
    (e) => {
      onChange(e);
      close();
    },
    [viewMode]
  );

  useClickOutside(datePickerRef, close);

  return (
    <div className="datePicker">
      <div onClick={toggle} className="position-relative">
        <input
          onChange={onChange}
          type="text"
          className="login-buttons"
          placeholder={placeholder}
          value={value && moment(value).format("DD - MMMM - YYYY")}
        />
        <Image
          src={images.calendar}
          className="showPasswordIcon signUp"
          alt="calendar"
          width={24}
          height={25}
        />
      </div>
      {isActive && (
        <Calendar
          inputRef={datePickerRef}
          onViewChange={(e) => {
            setViewMode(e.view);
          }}
          onChange={hanldeChange}
          value={value}
          locale={params.lng}
          className="calendar"
        />
      )}
    </div>
  );
};
