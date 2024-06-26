import classNames from "classnames";

export const ArrowDownIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.downArrowOFEvents ? "10" : "14"}
      height={props.downArrowOFEvents ? "5" : "17"}
      viewBox="0 0 14 8"
      fill="none"
      transform={classNames({
        "rotate(-90)": props?.viewAll,
        "rotate(-180)": props.isOpen,
      })}
      className={props.className}
    >
      <path
        d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976312 1.70711 0.292893L7 5.58579L12.2929 0.292893C12.6834 -0.0976317 13.3166 -0.0976317 13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L7.70711 7.70711C7.31658 8.09763 6.68342 8.09763 6.29289 7.70711L0.292893 1.70711C-0.097631 1.31658 -0.0976311 0.683418 0.292893 0.292893Z"
        fill={
          props?.viewAll
            ? "var(--global-color-casino-text_secondary)"
            : "var(--global-color-casino-text_primary)"
        }
      />
    </svg>
  );
};
