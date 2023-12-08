import classNames from "classnames";

const RenderMessages = ({ messages }) => {
  return messages?.map((message) => {
    return (
      <div
        className={message.from_cms ? "chat-item-left" : "chat-item-right"}
        key={message.message_id}
        id={message.message_id}
      >
        <div
          className={classNames("ChatMessage", { isRight: message.from_cms })}
        >
          {message.message}
        </div>
      </div>
    );
  });
};

export default RenderMessages;
