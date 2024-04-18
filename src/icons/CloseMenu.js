export const CloseMenu = ({ onClick, width = "30px", height = "30px" }) => {
  return (
    <div className="header-icon" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xlinkHref="http://www.w3.org/1999/xlink"
        viewBox="0 0 24 24"
        width={width}
        height={height}
      >
        <g id="surface114287541">
          <path
            d="M 4.707031 3.292969 L 3.292969 4.707031 L 10.585938 12 L 3.292969 19.292969 L 4.707031 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.707031 L 19.292969 3.292969 L 12 10.585938 Z M 4.707031 3.292969 "
            fill="var(--global-color-main-icon_primary)"
          />
        </g>
      </svg>
    </div>
  );
};
