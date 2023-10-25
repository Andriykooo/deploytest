import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import "./Chat.css";
import { useTranslations } from "next-intl";
import { SendMessage } from "@/utils/icons";

const TypingArea = ({
  onSubmit,
  value,
  onChange,
  maxLength,
  keyDownHandle,
  textareaHeight,
}) => {
  const t = useTranslations("common");
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
        placeholder={t("send_message")}
        onKeyDown={keyDownHandle}
      />
      <button className="chat-send-btn" type="submit">
        <SendMessage
          color={
            value.trim().length > 0 && "var(--global-color-trader-chat-primary)"
          }
        />
      </button>
    </form>
  );
};

export default TypingArea;
