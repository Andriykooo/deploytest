import { useState } from "react";
import { ArrowDownIcon } from "@/icons/ArrowDownIcon";
import { MatchOdds } from "../matches/MatchOdds";
import "./EventTable.css";

export const EventTable = ({ selections }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const visibleSelections = selections.slice(0, isOpen ? selections.length : 6);

  return (
    <div className="events-table-wrapper">
      <div className="events-table">
        <div className="events-contents-container">
          {visibleSelections.map((selection, index) => {
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
