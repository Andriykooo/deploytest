import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import "./DatePicker.css";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSelector } from "react-redux";
import WheelCalendar from "../modal/WheelCalendar";

export const DatePicker = ({
  value,
  onChange,
  defaultActiveStartDate,
  placeholder,
}) => {
  const params = useParams();
  const datePickerRef = useRef(null);
  const isTablet = useSelector((state) => state.isTablet);

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

  const hanldeChange = (e) => {
    onChange(e);
    close();
  };

  useClickOutside(datePickerRef, close);

  return (
    <>
      <div className="datePicker">
        <div onClick={toggle} className="position-relative" role="button">
          <input
            onChange={onChange}
            type="text"
            disabled
            className="login-buttons pe-none mb-0"
            placeholder={placeholder}
            value={value && moment(value).format("DD - MMMM - YYYY")} />
          <Image
            src={images.calendar}
            className="showPasswordIcon signUp"
            alt="calendar"
            width={24}
            height={25} />
        </div>
        {isActive && !isTablet && (
          <Calendar
            defaultActiveStartDate={defaultActiveStartDate}
            inputRef={datePickerRef}
            onViewChange={(e) => {
              setViewMode(e.view);
            }}
            onChange={hanldeChange}
            value={value}
            locale={params.lng}
            className="calendar" />
        )}
      </div>
      {isActive && isTablet && (
        <WheelCalendar
          defaultActiveStartDate={defaultActiveStartDate}
          setShowDate={setIsActive}
          setCalendarValue={onChange}
        />
      )}
    </>
  );
};
