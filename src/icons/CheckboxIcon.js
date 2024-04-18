export const CheckboxIcon = ({ active }) => {
  return (
    <svg
      style={{ visibility: `${active ? "visible" : "hidden"}` }}
      width="12"
      height="12"
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.45894 9.24251C4.33544 9.36444 4.1605 9.46605 4.00613 9.46605C3.85176 9.46605 3.67682 9.35936 3.54818 9.23743L1.13047 6.85033C0.875292 6.59838 0.875292 6.18645 1.13047 5.9345C1.3811 5.68705 1.78408 5.68705 2.03471 5.9345L4.01128 7.88605L9.9733 1.95704C10.2266 1.70519 10.6365 1.70791 10.8864 1.96309C11.1337 2.21568 11.1308 2.62055 10.8799 2.86959L4.45894 9.24251Z"
        fill="var(--global-color-main-background_primary)"
        stroke="var(--global-color-main-background_primary)"
      />
    </svg>
  );
};
