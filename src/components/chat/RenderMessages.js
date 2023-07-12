import { ChatMessage } from "./ChatStyled";

const RenderMessages = ({ messages }) => {
  return messages?.map((message) => {
    return (
      <div
        className={message.from_cms ? "chat-item-left" : "chat-item-right"}
        key={message.message_id}
      >
        <ChatMessage isRight={message.from_cms}>{message.message}</ChatMessage>
      </div>
    );
  });
};

export default RenderMessages;
