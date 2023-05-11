import { types } from "../../utils/constants";

export const BetSelectedTypes = () => {
  return (
    <div className="row w-100 m-0">
      <div className="col-12 sports-types">
        <div className="selected-types">
          {types.map((row, index) => {
            return (
              <div className="match-selected-type" key={index}>
                <span
                  className="match-selected-type-color"
                  style={{ background: row.color }}
                ></span>
                <span className="match-selected-type-name">{row.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
