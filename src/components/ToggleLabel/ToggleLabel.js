import classNames from "classnames";
import "./ToggleLabel.css";

const Switch = ({ checked, defaultValue, onChange }) => {
  const active = checked || defaultValue;

  return (
    <label className={classNames("switchLabel", { checked: active })}>
      <input
        className="switchInput"
        type="checkbox"
        checked={active}
        onChange={onChange}
      />
      <span className={classNames("switch", { checked: active })}></span>
    </label>
  );
};

export const ToggleLabel = ({ notification, onToggle, value, type }) => {
  const handleChange = (key, evtType) => {
    onToggle(key, evtType);
  };
  return (
    <div className="LabelWrapper">
      <Switch
        checked={value}
        defaultValue={value}
        onChange={() => handleChange(notification?.key, type)}
      />
      <div className="Label">{notification?.text}</div>
    </div>
  );
};
