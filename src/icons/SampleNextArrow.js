import classNames from "classnames";

export const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <svg
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("nextSvg", className)}
      id="nextSvg"
      onClick={onClick}
      style={{ ...style }}
    >
      <path
        d="M0.366117 17.6234C-0.122039 17.1213 -0.122039 16.3073 0.366116 15.8051L6.98223 9L0.366116 2.19485C-0.12204 1.69275 -0.12204 0.878679 0.366116 0.376577C0.854271 -0.125526 1.64573 -0.125527 2.13388 0.376577L9.63388 8.09086C10.122 8.59296 10.122 9.40703 9.63388 9.90914L2.13388 17.6234C1.64573 18.1255 0.854272 18.1255 0.366117 17.6234Z"
        fill="white"
      />
    </svg>
  );
};
