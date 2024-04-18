export const ProfileValidatedIcon = ({ className }) => {
  return (
    <div className={className}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="11.25"
          stroke="var(--global-color-main-icon_primary)"
          style={{ strokeWidth: "1.5" }}
        />
        <path
          d="M17.7763 7.50165C18.0514 7.74626 18.0762 8.16765 17.8316 8.44284L10.7205 16.4428C10.594 16.5852 10.4127 16.6666 10.2222 16.6666C10.0318 16.6666 9.85047 16.5852 9.72396 16.4428L6.1684 12.4428C5.92379 12.1676 5.94858 11.7463 6.22376 11.5017C6.49895 11.257 6.92033 11.2818 7.16495 11.557L10.2222 14.9965L16.8351 7.55702C17.0797 7.28183 17.5011 7.25704 17.7763 7.50165Z"
          fill="var(--global-color-main-icon_primary)"
          stroke="var(--global-color-main-icon_primary)"
          style={{
            strokeWidth: "0.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </svg>
    </div>
  );
};
