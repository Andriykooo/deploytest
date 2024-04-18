export const ReminderIcon = ({ className }) => {
  return (
    <div className={className}>
      <svg
        width="65"
        height="64"
        viewBox="0 0 65 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M44.0525 23.0038C44.6029 23.493 44.6525 24.3358 44.1632 24.8862L29.941 40.8862C29.688 41.1708 29.3253 41.3337 28.9445 41.3337C28.5636 41.3337 28.2009 41.1708 27.9479 40.8862L20.8368 32.8862C20.3476 32.3358 20.3972 31.493 20.9475 31.0038C21.4979 30.5146 22.3407 30.5641 22.8299 31.1145L28.9445 37.9934L42.1701 23.1145C42.6594 22.5641 43.5021 22.5146 44.0525 23.0038Z"
          fill="var(--global-color-main-icon_primary)"
        />
        <circle
          cx="32.5"
          cy="32"
          r="30.5"
          stroke="var(--global-color-main-background_primary)"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};
