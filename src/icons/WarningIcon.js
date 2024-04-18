export const WarningIcon = ({ className }) => {
  return (
    <svg
      width="90"
      height="89"
      viewBox="0 0 90 89"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="1.5"
        width="87"
        height="86"
        rx="43"
        stroke="var(--global-color-gaming-logo_primary)"
        strokeWidth="3"
      />
      <path
        d="M45 59.2559C42.7908 59.2559 41 61.0467 41 63.2559C41 65.465 42.7908 67.2559 45 67.2559C47.2092 67.2559 49 65.465 49 63.2559C49 61.0467 47.2092 59.2559 45 59.2559Z"
        fill="var(--global-color-gaming-logo_secondary)"
      />
      <path
        d="M45 21.7446C42.7908 21.7446 41 23.5355 41 25.7446V52.3224C41 54.5316 42.7908 56.3224 45 56.3224C47.2092 56.3224 49 54.5316 49 52.3224V25.7446C49 23.5355 47.2092 21.7446 45 21.7446Z"
        fill="var(--global-color-gaming-logo_secondary)"
      />
    </svg>
  );
};
