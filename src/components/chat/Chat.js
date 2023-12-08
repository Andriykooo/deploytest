"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { images } from "../../utils/imagesConstant";
import { useDispatch, useSelector } from "react-redux";
import RenderMessages from "./RenderMessages";
import TypingArea from "./TypingArea";
import { setSidebarLeft } from "../../store/actions";
import { useTranslations } from "next-intl";
import { ChatIcon } from "@/utils/icons";
import { CustomLink } from "../Link/Link";
import { getLocalStorageItem } from "@/utils/localStorage";
import { communicationSocket } from "@/context/socket";
import { useClientPathname } from "@/hooks/useClientPathname";
import classNames from "classnames";
import "./Chat.css";

export const Chat = ({ isOpen, isMobile = false }) => {
  const dispatch = useDispatch();
  const t = useTranslations();
  const { pathname } = useClientPathname();

  const chatBlockRef = useRef(null);
  const messagesRef = useRef(null);

  const sidebarLeft = useSelector((state) => state.sidebarLeft);
  const loggedUser = useSelector((state) => state.loggedUser);

  const [isChatActive, setIsChatActive] = useState(false);
  const [writtenMessage, setWrittenMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastMessageId, setLastMessageId] = useState();

  const hasNextPage = currentPage < totalPages;

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
            ...messagesHistory.data.messages.reverse(),
            ...prev,
          ]);
        }
      );
    }
  };

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

  const changeMessageHandler = (event) => {
    setWrittenMessage(event.target.value);
  };

  const keyDownHandle = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessageHandler(event);
    }
  };

  const sendMessageHandler = (event) => {
    event.preventDefault();
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
      setMessages((prev) => [...prev, newMessage]);
      setDisableScroll(false);
    });

    return () => {
      communicationSocket.off("new_chat_message");
    };
  }, []);

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
    <div className={classNames("ChatWrapper", { isOpen })}>
      {isChatActive && (
        <div className={classNames("ChatBox", { isOpen })}>
          <div className="ChatHeader">
            <div>{t("chat.live_chat")}</div>
            <span onClick={chatCloseHandler}>
              <Image
                height={18}
                width={18}
                src={images.rollUpIcon}
                alt="rollUp"
              />
            </span>
          </div>
          <div className="ChattingBlock">
            {loggedUser && getLocalStorageItem("access_token") ? (
              <div
                className="MessagesBlock"
                onScroll={scrollHandler}
                ref={messagesRef}
              >
                <RenderMessages messages={messages} />
                <div ref={chatBlockRef}></div>
              </div>
            ) : (
              <div className="UnLoggedMessage">
                <p>
                  {t("chat.please")}{" "}
                  <CustomLink
                    href={`/login?redirect=${pathname.replace("/", "")}`}
                  >
                    {t("chat.log_in")}
                  </CustomLink>{" "}
                  {t("chat.to_send_a_message")}
                </p>
              </div>
            )}
          </div>
          <TypingArea
            disabled={!loggedUser}
            onSubmit={sendMessageHandler}
            maxLength={500}
            value={writtenMessage}
            onChange={changeMessageHandler}
            keyDownHandle={keyDownHandle}
          />
        </div>
      )}
      <div
        className="ChatBottomWrapper"
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
        <div className="ChatBottomSubWrapper">
          <div className="ChatIconStyled">
            <ChatIcon isMobile={isMobile} />
          </div>
          {isOpen && <div className="ChatTitle">{t("chat.chat")}</div>}
        </div>
        {numberUnreadMessage > 0 && (
          <div className={classNames("NumberNewMessages", { isOpen })}>
            {numberUnreadMessage}
          </div>
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
      </div>
    </div>
  );
};
