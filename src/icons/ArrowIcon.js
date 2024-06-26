export const ArrowIcon = ({
  className,
  color = "var(--global-color-main-icon_primary)",
}) => {
  return (
    <svg
      alt="arrow"
      className={className}
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.7616 7.70711C13.3727 8.09763 12.7421 8.09763 12.3532 7.70711L7.08197 2.41421L1.81077 7.70711C1.42185 8.09763 0.791276 8.09763 0.402352 7.70711C0.0134277 7.31658 0.0134277 6.68342 0.402352 6.29289L6.37776 0.292894C6.76669 -0.0976311 7.39726 -0.0976312 7.78618 0.292894L13.7616 6.29289C14.1505 6.68342 14.1505 7.31658 13.7616 7.70711Z"
        fill={color}
      />
    </svg>
  );
};
