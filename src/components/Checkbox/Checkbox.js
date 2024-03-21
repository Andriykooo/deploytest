import classNames from "classnames";
import "./Checkbox.css";

export const Checkbox = ({ onChange, value }) => {
  const handleCheckboxChange = () => {
    onChange(!value);
  };

  return (
    <label className={classNames("checkbox-label", { active: value })}>
      <input
        type="checkbox"
        checked={value}
        onChange={handleCheckboxChange}
        className="checkbox-input"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className="checkbox-check"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.459 9.74251C4.33551 9.86444 4.16056 9.96605 4.00619 9.96605C3.85183 9.96605 3.67688 9.85936 3.54824 9.73743L0.666748 6.89241L1.58265 5.98811L4.01134 8.38605L10.4329 2L11.3334 2.91955L4.459 9.74251Z"
          fill="#C59E43"
        />
      </svg>
    </label>
  );
};
