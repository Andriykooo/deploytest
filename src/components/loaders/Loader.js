import "./Loader.css";

export const Loader = () => {
  return (
    <div className="snippet" data-title=".dot-flashing">
      <div className="stage">
        <div className="dot-flashing"></div>
      </div>
    </div>
  );
};

export const LoaderXs = () => {
  return (
    <div className="snippet" data-title=".dot-flashing">
      <div className="stage">
        <div className="dot-flashing xs"></div>
      </div>
    </div>
  );
};

export const SpinningLoader = () => {
  return (
    <div className="lds-ring place-bet">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <span className="place-bet">{"Logging out"}</span>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="snippet page-loader" data-title=".dot-flashing">
      <div className="stage">
        <div className="dot-flashing"></div>
      </div>
    </div>
  );
};
