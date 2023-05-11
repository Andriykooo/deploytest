import { useState } from "react";
import { ArrowDownIcon } from "../../utils/icons";

export const EventTable = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="events-table">
      <div className="events-contents-container">
        {data?.slice(0, isOpen ? data?.length : 6)?.map((event, index) => {
          return (
            <div key={index} className="events-container">
              <span className="text-of-events">{event.name}</span>
              <span className="odds-of-events">{event.odd}</span>
            </div>
          );
        })}
      </div>
      <div className="more-container-in-events" onClick={toggle}>
        <span className="more-sidebar-in-events">
          {isOpen ? "Less" : "More"}
        </span>
        <ArrowDownIcon downArrowOFEvents isOpen={isOpen} />
      </div>
    </div>
  );
};
