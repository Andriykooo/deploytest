import { setTooltip } from "@/store/actions";
import { memo } from "react";
import { useDispatch } from "react-redux";

export const TooltipWrapper = memo(({ children, className, message, show }) => {
  const dispatch = useDispatch();

  const onMouseEnterHandler = (e) => {
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
  };

  const onMouseLeaveHandler = () => {
    dispatch(setTooltip(null));
  };

  return show ? (
    <div
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      className="h-100 w-100 d-flex"
    >
      {children}
    </div>
  ) : (
    children
  );
});
