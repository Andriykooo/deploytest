import { useState } from "react";
import { ArrowDownIcon } from "../../utils/icons";
import { MatchOdds } from "../matches/MatchOdds";
import "./EventTable.css";

function groupByThree(array) {
  const result = [];

  for (let i = 0; i < array.length; i += 3) {
    const group = array.slice(i, i + 3);
    result.push(group);
  }

  return result;
}

export const EventTable = ({ selections }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const groupedSelections = groupByThree(selections);

  return (
    <div className="events-table-wrapper">
      <div className="events-table">
        {groupedSelections
          ?.slice(0, isOpen ? groupedSelections?.length : 2)
          ?.map((selections, index) => {
            return (
              <div className="events-contents-container" key={index}>
                {selections.map((selection, index) => {
                  return (
                    <div key={index} className="events-container">
                      <span className="text-of-events">{selection.name}</span>
                      <div className="odds-of-events">
                        <MatchOdds selection={selection} />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

        {selections.length > 6 && (
          <div className="more-container-in-events" onClick={toggle}>
            <span className="more-sidebar-in-events">
              {isOpen ? "Less" : "More"}
            </span>
            <ArrowDownIcon
              downArrowOFEvents
              isOpen={isOpen}
              className="more-container-arrow"
            />
          </div>
        )}
      </div>
    </div>
  );
};
