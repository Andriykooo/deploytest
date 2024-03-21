import { setTooltip } from "@/store/actions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const TooltipWrapper = ({ children, className, message, show }) => {
  const dispatch = useDispatch();

  const onMouseEnterHandler = (e) => {
    if (show) {
      const rect = e?.target?.getBoundingClientRect();

      dispatch(
        setTooltip({
          x: rect.x,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          className,
          message,
        })
      );
    }
  };

  const onMouseLeaveHandler = () => {
    if (show) {
      dispatch(setTooltip(null));
    }
  };

  useEffect(() => {
    if (!show) {
      dispatch(setTooltip(null));
    }

    return () => {
      dispatch(setTooltip(null));
    };
  }, [show]);

  return (
    <div
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      className="h-100 w-100 d-flex"
    >
      {children}
    </div>
  );
};
