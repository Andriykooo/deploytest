import classNames from "classnames";

export const SearchIcon = ({ className }) => {
  return (
    <div className={classNames("sports-search-icon", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M7.5 3C5.01472 3 3 5.01472 3 7.5C3 9.98528 5.01472 12 7.5 12C9.98528 12 12 9.98528 12 7.5C12 5.01472 9.98528 3 7.5 3ZM1.5 7.5C1.5 4.18629 4.18629 1.5 7.5 1.5C10.8137 1.5 13.5 4.18629 13.5 7.5C13.5 8.88653 13.0297 10.1632 12.2399 11.1792L16.2803 15.2197C16.5732 15.5126 16.5732 15.9874 16.2803 16.2803C15.9874 16.5732 15.5126 16.5732 15.2197 16.2803L11.1792 12.2399C10.1632 13.0297 8.88653 13.5 7.5 13.5C4.18629 13.5 1.5 10.8137 1.5 7.5Z"
          fill="white"
        />
      </svg>
    </div>
  );
};
