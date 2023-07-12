import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/socket";
import { setTradingChatSettings } from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import {
  ChatBottomSubWrapper,
  ChatBottomWrapper,
  ChatBox,
  ChatHeader,
  ChatIcon,
  ChattingBlock,
  ChatTitle,
  ChatWrapper,
  MessagesBlock,
  NumberNewMessages,
} from "./ChatStyled";
import RenderMessages from "./RenderMessages";
import TypingArea from "./TypingArea";

const minHeightTextarea = 16;
const maxHeightTextarea = 80;

export const Chat = ({ isOpen }) => {
  const dispatch = useDispatch();
  const chatBlockRef = useRef(null);
  const { communicationSocket } = useContext(SocketContext);
  const tradingChat = useSelector((state) => state.tradingChat);

  const [isChatActive, setIsChatActive] = useState(false);
  const [writtenMessage, setWrittenMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [textareaHeight, setTextareaHeight] = useState(minHeightTextarea);

  const chatCloseHandler = () => {
    setIsChatActive(false);
    setWrittenMessage("");
  };

  const scrollMessage = () => {
    const chatBlock = chatBlockRef.current;
    chatBlock && chatBlock.scrollIntoView();
  };

  useEffect(() => {
    scrollMessage();
  }, [textareaHeight]);

  const changeMessageHandler = (event) => {
    const { scrollHeight, value } = event.target;
    setWrittenMessage(value);

    if (!value.length) {
      setTextareaHeight(minHeightTextarea);
      return;
    }

    if (
      scrollHeight <= maxHeightTextarea &&
      scrollHeight % minHeightTextarea === 0
    ) {
      setTextareaHeight(scrollHeight);
    }
  };

  useEffect(() => {
    apiServices.get(apiUrl.GET_TRADER_CHAT_SETTINGS).then((result) => {
      dispatch(setTradingChatSettings(result));
    });
  }, []);

  useEffect(() => {
    if (tradingChat?.isTraderChatEnabled) {
      communicationSocket.emit("last_messages", {}, (messagesHistory) => {
        setMessages(messagesHistory?.data?.[0]?.messages.reverse() || []);
      });

      communicationSocket.on("new_chat_message", (newMessage) => {
        if (isChatActive) {
          communicationSocket.emit("read_messages", {
            messageIds: [newMessage.message_id],
            roomId: newMessage?.room_id,
          });

          newMessage.is_read = true;
        }

        setMessages((prev) => [...prev, newMessage]);
      });
    }
  }, [tradingChat]);

  const keyDownHandle = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessageHandler(event);
    }
  };

  const sendMessageHandler = (event) => {
    event.preventDefault();
    setTextareaHeight(minHeightTextarea);
    if (writtenMessage.trim().length > 0) {
      communicationSocket.emit(
        "player_chat_message",
        {
          message: writtenMessage,
        },
        (response) => {
          if (response.data) {
            setMessages((prev) => [
              ...prev,
              {
                ...response.data,
                is_read: true,
              },
            ]);
            setWrittenMessage("");
          }
        }
      );
    }
  };

  useEffect(() => {
    scrollMessage();

    if (isChatActive) {
      const readMessagesIds = messages
        ?.filter((message) => !message.is_read && message.from_cms)
        ?.map((message) => message.message_id);

      if (readMessagesIds?.length > 0) {
        communicationSocket.emit("read_messages", {
          messageIds: readMessagesIds,
          roomId: messages?.[0]?.room_id,
        });

        setMessages(
          messages?.map((message) => {
            if (!message.is_read && message.from_cms) {
              return {
                ...message,
                is_read: true,
              };
            }

            return message;
          })
        );
      }
    }
  }, [messages, isChatActive]);

  const numberUnreadMessage = messages?.reduce((accumulator, currentValue) => {
    if (!currentValue?.is_read && currentValue.from_cms) {
      return accumulator + 1;
    }

    return accumulator;
  }, 0);

  return (
    <ChatWrapper isOpen={isOpen}>
      {isChatActive && (
        <ChatBox isOpen={isOpen}>
          <ChatHeader>
            <div>Got questions? Our team is ready to help.</div>
            <span onClick={chatCloseHandler}>
              <Image
                height={18}
                width={18}
                src={images.rollUpIcon}
                alt="rollUp"
              />
            </span>
          </ChatHeader>
          <ChattingBlock
            textareaHeight={
              textareaHeight + (textareaHeight === minHeightTextarea ? 104 : 90)
            }
          >
            <MessagesBlock>
              <RenderMessages messages={messages} />
              <div ref={chatBlockRef}></div>
            </MessagesBlock>
          </ChattingBlock>
          <TypingArea
            onSubmit={sendMessageHandler}
            maxLength={500}
            value={writtenMessage}
            onChange={changeMessageHandler}
            keyDownHandle={keyDownHandle}
            textareaHeight={textareaHeight}
          />
        </ChatBox>
      )}
      <ChatBottomWrapper
        onClick={() => {
          if (tradingChat) {
            setIsChatActive((prevState) => !prevState);
          }
        }}
      >
        {tradingChat?.isTraderChatEnabled && (
          <>
            <ChatBottomSubWrapper>
              <ChatIcon>
                <Image src={images.chatIconWhite} alt="chat" />
              </ChatIcon>
              {isOpen && <ChatTitle>Chat</ChatTitle>}
            </ChatBottomSubWrapper>
            {numberUnreadMessage > 0 && (
              <NumberNewMessages isOpen={isOpen}>
                {numberUnreadMessage}
              </NumberNewMessages>
            )}
            {isOpen && (
              <Image
                src={images.arrowIcon}
                className="chat-arrow"
                alt="chat"
                width={14}
                height={8}
              />
            )}
          </>
        )}
      </ChatBottomWrapper>
    </ChatWrapper>
  );
};
