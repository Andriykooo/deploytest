'use client';

import classNames from "classnames";
import moment from "moment";
import { Fragment } from "react";

const RenderMessages = ({ messages, userUTCOffset }) => {
  const currentDate = moment();
  let prevDate = null;

  return messages?.map((message) => {
    const isToday = currentDate.isSame(moment(message.created_at), 'day');
    const messageDate = isToday ? 'Today' : moment(message.created_at).format("ddd, D MMM");
    const messageTime = moment(message.created_at).clone().add(-userUTCOffset, 'minutes').format("HH:mm A");
    const printDate = prevDate !== messageDate;
    prevDate = messageDate;

    return (
      <Fragment key={message.message_id}>
        {printDate && (
          <div className="message-date">
            <div className="message-date-line"></div>
            <span>{messageDate}</span>
          </div>
        )}
        <div
          className={message.from_cms ? "chat-item-left" : "chat-item-right"}
          id={message.message_id}
        >
          <div
            className={classNames("ChatMessage", { isRight: message.from_cms })}
          >
            {message.message}
          </div>
          <span className="message-time">{messageTime}</span>
        </div>
      </Fragment>
    );
  });
};

export default RenderMessages;
