import "./Chat.css";
import { useTranslations } from "next-intl";
import { SendMessage } from "@/utils/icons";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

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
  const isTablet = useSelector((state) => state.isTablet);

  useEffect(() => {
    if (textareaRef?.current && value) {
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
            value.trim().length > 0 ? (isTablet ? "#CCD1D5" : "var(--global-color-trader_chat-shade_secondary)") : null
          }
        />
      </button>
    </form>
  );
};

export default TypingArea;
