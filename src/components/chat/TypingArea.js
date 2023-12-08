import "./Chat.css";
import { useTranslations } from "next-intl";
import { SendMessage } from "@/utils/icons";
import { useEffect, useRef } from "react";

const TypingArea = ({
  onSubmit,
  value,
  onChange,
  maxLength,
  keyDownHandle,
  disabled = false,
}) => {
  const t = useTranslations("common");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;

      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [textareaRef, value]);

  return (
    <form className="typing-area-form" onSubmit={onSubmit}>
      <textarea
        ref={textareaRef}
        disabled={disabled}
        className="chat-textarea"
        maxLength={maxLength}
        value={value.length > 0 ? value : ""}
        onChange={onChange}
        rows={1}
        placeholder={t("send_message")}
        onKeyDown={keyDownHandle}
      />
      <button disabled={disabled} className="chat-send-btn" type="submit">
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
