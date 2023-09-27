import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import "./Chat.css";
import { useClientTranslation } from "@/app/i18n/client";

const TypingArea = ({
  onSubmit,
  value,
  onChange,
  maxLength,
  keyDownHandle,
  textareaHeight,
}) => {
  const { t } = useClientTranslation("common");
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
