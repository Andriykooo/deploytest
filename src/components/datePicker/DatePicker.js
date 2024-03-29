import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSelector } from "react-redux";
import WheelCalendar from "../modal/WheelCalendar";
import "react-calendar/dist/Calendar.css";
import "./DatePicker.css";
import { CalendarIcon } from "@/utils/icons";
import "moment/min/locales";

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
  // eslint-disable-next-line
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

  useEffect(() => {
    moment.locale(params.lng);
  }, []);

  useClickOutside(datePickerRef, close);

  return (
    <>
      <div className="datePicker">
        <div onClick={toggle} className="position-relative" role="button">
          <input
            onChange={onChange}
            type="text"
            className="login-buttons pe-none mb-0"
            placeholder={placeholder}
            value={value && moment(value).format("DD - MMMM - YYYY")}
          />
          <CalendarIcon className="showPasswordIcon signUp" />
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
            className="calendar"
          />
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
