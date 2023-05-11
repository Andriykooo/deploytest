import { styled } from "@mui/material/styles";
import { Label, LabelWrapper } from "../../components/inputs/CustomInput";
import Switch from "@mui/material/Switch";

export const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    width: "50%",
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(1rem)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#1976d2" : "#BC9239",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#1976d2",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export const ToggleLabel = ({
  notification,
  onToggle,
  value,
  type,
  isMobile,
  last,
  first,
}) => {
  const handleChange = (key, evtType) => {
    onToggle(key, evtType);
  };
  return (
    <LabelWrapper flexStart={!isMobile} last={last} first={first} type={type}>
      <IOSSwitch
        checked={value}
        defaultValue={value}
        onChange={() => handleChange(notification.key, type)}
      />
      <Label ml={!isMobile} ml0={isMobile} mb0 font="20">
        {notification.text}
      </Label>
    </LabelWrapper>
  );
};
