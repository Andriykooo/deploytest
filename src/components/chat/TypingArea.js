import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import "./Chat.css";

const TypingArea = ({
  onSubmit,
  value,
  onChange,
  maxLength,
  keyDownHandle,
  textareaHeight,
}) => {
  return (
    <form className="typing-area-form" onSubmit={onSubmit}>
      <textarea
        style={{ height: `${textareaHeight}px` }}
        className="chat-textarea"
        maxLength={maxLength}
        value={value.length > 0 ? value : ""}
        onChange={(e) => {
          onChange(e);
        }}
        placeholder="Send a message..."
        onKeyDown={keyDownHandle}
      />
      <button className="chat-send-btn" type="submit">
        <Image
          height={30}
          width={30}
          src={
            value.trim().length > 0
              ? images.sendMessageGold
              : images.sendMessageIcon
          }
          alt="send"
        />
      </button>
    </form>
  );
};

export default TypingArea;
