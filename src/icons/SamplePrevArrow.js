import classNames from "classnames";

export const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <svg
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("previousSvg", className)}
      id="previousSvg"
      onClick={onClick}
      style={{ ...style }}
    >
      <path
        d="M9.63388 0.376577C10.122 0.87868 10.122 1.69275 9.63388 2.19485L3.01777 9L9.63388 15.8051C10.122 16.3073 10.122 17.1213 9.63388 17.6234C9.14573 18.1255 8.35427 18.1255 7.86612 17.6234L0.366115 9.90914C-0.12204 9.40703 -0.12204 8.59297 0.366115 8.09086L7.86612 0.376577C8.35427 -0.125526 9.14573 -0.125526 9.63388 0.376577Z"
        fill="white"
      />
    </svg>
  );
};
