export const SendMessage = ({ color }) => {
  return (
    <svg
      width="30"
      alt="send"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.24229 2.75587C4.62998 2.46037 5.15409 2.41719 5.58492 2.64527L26.8349 13.8953C27.2442 14.1119 27.5 14.537 27.5 15C27.5 15.463 27.2442 15.8881 26.8349 16.1048L5.58492 27.3548C5.15409 27.5828 4.62998 27.5396 4.24229 27.2441C3.8546 26.9486 3.67407 26.4546 3.77982 25.9789L6.21955 15L3.77982 4.02117C3.67407 3.5453 3.8546 3.05138 4.24229 2.75587ZM8.50277 16.25L6.80749 23.8788L21.2174 16.25H8.50277ZM21.2174 13.75H8.50277L6.80749 6.12125L21.2174 13.75Z"
        fill={color || "var(--global-color-trader-chat-disabled)"}
      />
    </svg>
  );
};
