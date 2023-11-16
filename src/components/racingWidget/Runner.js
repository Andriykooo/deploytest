import classNames from "classnames";

export const Runner = ({ data, slug, className }) => {
  const disableNumbers = slug === "greyhoundracing";

  return (
    <div className={classNames("runner", className)}>
      {!disableNumbers && (
        <div className="runner-number">
          <div>{data.runner_num}</div>
          {data.stale_num && <div>({data.stale_num})</div>}
        </div>
      )}
      <div className="d-flex align-items-start flex-column">
        <div className="selection-name">{data.name}</div>
        <div className="selection-description">{data.description}</div>
      </div>
    </div>
  );
};
