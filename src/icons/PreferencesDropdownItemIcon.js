export const PreferencesDropdownItemIcon = ({ className }) => {
  return (
    <div className={className}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="10"
          cy="10"
          r="9.25"
          stroke="var(--global-color-main-icon_primary)"
          style={{ strokeWidth: "1.5" }}
        />
        <path
          d="M14.3322 6.6263C14.5386 6.80976 14.5572 7.1258 14.3737 7.33219L9.04038 13.3322C8.94549 13.4389 8.80949 13.5 8.66667 13.5C8.52385 13.5 8.38785 13.4389 8.29297 13.3322L5.6263 10.3322C5.44284 10.1258 5.46143 9.80976 5.66782 9.6263C5.87421 9.44284 6.19025 9.46143 6.37371 9.66782L8.66667 12.2474L13.6263 6.66782C13.8098 6.46143 14.1258 6.44284 14.3322 6.6263Z"
          fill="var(--global-color-main-icon_primary)"
          stroke="var(--global-color-main-icon_primary)"
          style={{
            strokeWidth: "0.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </svg>
    </div>
  );
};
