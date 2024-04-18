export const Number1 = ({ isMobile }) => {
  return isMobile ? (
    <svg
      width="7"
      height="17"
      viewBox="0 0 7 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.86861 0.702698V16.1081H3.81177V3.79431H3.72705L0.416058 6.00583V3.11732L3.99532 0.702698H6.86861Z"
        fill="var(--global-color-casino-trending_text)"
      />
    </svg>
  ) : (
    <svg
      width={isMobile ? "7" : "14"}
      height={isMobile ? "17" : "30"}
      viewBox="0 0 14 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.7372 0V30H7.62354V6.02051H7.45411L0.832123 10.3271V4.70215L7.99065 0H13.7372Z"
        fill="var(--global-color-casino-trending_text)"
      />
    </svg>
  );
};
