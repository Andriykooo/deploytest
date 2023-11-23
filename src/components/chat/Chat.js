"use client";

import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../context/socket";
import { images } from "../../utils/imagesConstant";
import { useDispatch, useSelector } from "react-redux";

import {
  ChatBottomSubWrapper,
  ChatBottomWrapper,
  ChatBox,
  ChatHeader,
  ChatIconStyled,
  ChatTitle,
  ChatWrapper,
  ChattingBlock,
  MessagesBlock,
  NumberNewMessages,
  UnLoggedMessage,
} from "./ChatStyled";
import RenderMessages from "./RenderMessages";
import TypingArea from "./TypingArea";
import { setSidebarLeft } from "../../store/actions";
import { useTranslations } from "next-intl";
import { ChatIcon } from "@/utils/icons";
import { CustomLink } from "../Link/Link";

const minHeightTextarea = 16;
const maxHeightTextarea = 80;

export const Chat = ({ isOpen, isMobile = false }) => {
  const t = useTranslations();
  const chatBlockRef = useRef(null);
  const messagesRef = useRef(null);
  const dispatch = useDispatch();
  const sidebarLeft = useSelector((state) => state.sidebarLeft);
  const loggedUser = useSelector((state) => state.loggedUser);

  const { communicationSocket } = useContext(SocketContext);

  const [isChatActive, setIsChatActive] = useState(false);
  const [writtenMessage, setWrittenMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [textareaHeight, setTextareaHeight] = useState(minHeightTextarea);
  const [isFetching, setIsFetching] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastMessageId, setLastMessageId] = useState();

  const fetchNextPage = () => {
    if (loggedUser) {
      setIsFetching(true);

      communicationSocket.emit(
        "last_messages",
        { page: currentPage + 1 },
        (messagesHistory) => {
          setCurrentPage(messagesHistory.data.current_page);
          setTotalPages(messagesHistory.data.total_pages);
          setIsFetching(false);
          setMessages((prev) => [
            ...messagesHistory?.data?.messages?.reverse(),
            ...prev,
          ]);
        }
      );
    }
  };

  const hasNextPage = currentPage < totalPages;

  const scrollHandler = (e) => {
    if (e.target.scrollTop < 10 && !isFetching && hasNextPage) {
      fetchNextPage();
      setDisableScroll(true);
    }
  };

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
    if (loggedUser) {
      communicationSocket.emit(
        "last_messages",
        { page: currentPage },
        (messagesHistory) => {
          setMessages(messagesHistory?.data?.messages?.reverse() || []);
          setCurrentPage(messagesHistory.data.current_page);
          setTotalPages(messagesHistory.data.total_pages);
        }
      );

      communicationSocket.on("new_chat_message", (newMessage) => {
        if (isChatActive) {
          communicationSocket.emit("read_messages", {
            messageIds: [newMessage.message_id],
            roomId: newMessage?.room_id,
          });

          newMessage.is_read = true;
        }

        setMessages((prev) => [...prev, newMessage]);
        setDisableScroll(false);
      });
    }
  }, [loggedUser]);

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
            setDisableScroll(false);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (isChatActive && loggedUser) {
      if (
        messagesRef.current.scrollHeight <= messagesRef.current.clientHeight &&
        !isFetching &&
        hasNextPage
      ) {
        fetchNextPage();

        return;
      }

      if (!disableScroll) {
        scrollMessage();
      } else {
        document.getElementById(lastMessageId).scrollIntoView(true);
      }

      setLastMessageId(messages[0]?.message_id);
      setDisableScroll(false);

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
  }, [messages, isChatActive, loggedUser]);

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
            <div>{t("chat.live_chat")}</div>
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
            {loggedUser && getLocalStorageItem("access_token") ? (
              <MessagesBlock onScroll={scrollHandler} ref={messagesRef}>
                <RenderMessages messages={messages} />
                <div ref={chatBlockRef}></div>
              </MessagesBlock>
            ) : (
              <UnLoggedMessage>
                <p>
                  {t("chat.please")}{" "}
                  <CustomLink href="/login">{t("chat.log_in")}</CustomLink>{" "}
                  {t("chat.to_send_a_message")}
                </p>
              </UnLoggedMessage>
            )}
          </ChattingBlock>
          <TypingArea
            disabled={!loggedUser}
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
          if (isMobile) {
            dispatch(
              setSidebarLeft({
                ...sidebarLeft,
                isActive: false,
              })
            );
          }
          setIsChatActive((prevState) => !prevState);
        }}
      >
        <ChatBottomSubWrapper>
          <ChatIconStyled>
            <ChatIcon isMobile={isMobile} />
          </ChatIconStyled>
          {isOpen && <ChatTitle>{t("chat.chat")}</ChatTitle>}
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
      </ChatBottomWrapper>
    </ChatWrapper>
  );
};
