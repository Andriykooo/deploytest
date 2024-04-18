export const ValidIcon = ({ className, alt }) => {
  return (
    <svg
      alt={alt}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="11"
        stroke="var(--global-color-main-icon_primary)"
        strokeWidth="2"
      />
      <path
        d="M17.7763 7.50173C18.0514 7.74634 18.0762 8.16772 17.8316 8.44291L10.7205 16.4429C10.594 16.5852 10.4127 16.6667 10.2222 16.6667C10.0318 16.6667 9.85047 16.5852 9.72396 16.4429L6.1684 12.4429C5.92379 12.1677 5.94858 11.7463 6.22376 11.5017C6.49895 11.2571 6.92033 11.2819 7.16495 11.5571L10.2222 14.9965L16.8351 7.55709C17.0797 7.2819 17.5011 7.25712 17.7763 7.50173Z"
        fill="var(--global-color-main-icon_primary)"
        stroke="var(--global-color-main-icon_primary)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
