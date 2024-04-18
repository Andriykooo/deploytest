"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { images } from "../../utils/imagesConstant";
import { useDispatch, useSelector } from "react-redux";
import RenderMessages from "./RenderMessages";
import TypingArea from "./TypingArea";
import { setSidebarLeft } from "../../store/actions";
import { useTranslations } from "@/hooks/useTranslations";
import { ChatIcon } from "@/icons/ChatIcon";
import { ProfileArrowIcon } from "@/icons/ProfileArrowIcon";
import { CustomLink } from "../Link/Link";
import { getLocalStorageItem } from "@/utils/localStorage";
import { communicationSocket } from "@/context/socket";
import Spiner from "../Spiner/Spiner";
import classNames from "classnames";
import "./Chat.css";

export const Chat = ({ isOpen, isMobile = false }) => {
  const dispatch = useDispatch();
  const t = useTranslations();

  const chatBlockRef = useRef(null);
  const messagesRef = useRef(null);

  const sidebarLeft = useSelector((state) => state.sidebarLeft);
  const loggedUser = useSelector((state) => state.loggedUser);
  const isTablet = useSelector((state) => state.isTablet);

  const [isChatActive, setIsChatActive] = useState(false);
  const [writtenMessage, setWrittenMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const previousScrollHeightRef = useRef(null);

  const hasNextPage = currentPage < totalPages;
  const userUTCOffset = new Date().getTimezoneOffset();

  const fetchNextPage = () => {
    if (loggedUser) {
      setIsFetching(true);

      communicationSocket.emit(
        "last_messages",
        { page: currentPage + 1 },
        (messagesHistory) => {
          previousScrollHeightRef.current = messagesRef.current.scrollHeight;
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
    if (e.target.scrollTop === 0 && !isFetching && hasNextPage) {
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
        messagesRef?.current?.scrollHeight <=
          messagesRef?.current?.clientHeight &&
        !isFetching &&
        hasNextPage
      ) {
        fetchNextPage();

        return;
      }

      if (!disableScroll) {
        scrollMessage();
      }

      if (previousScrollHeightRef.current && messagesRef.current) {
        const newScrollHeight =
          messagesRef.current.scrollHeight - previousScrollHeightRef.current;

        messagesRef.current.scrollTop = newScrollHeight;
        previousScrollHeightRef.current = null;
      }

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
      <div className={classNames("ChatBox", { isOpen, isChatActive })}>
        <div className="ChatHeader">
          <div>{t("chat.live_chat")}</div>
          <span onClick={chatCloseHandler}>
            {isTablet ? (
              <Image
                height={24}
                width={24}
                src={images.closeIcon}
                alt="close"
              />
            ) : (
              <Image
                height={18}
                width={18}
                src={images.rollUpIcon}
                alt="rollUp"
              />
            )}
          </span>
        </div>

        <div className="ChattingBlock">
          {loggedUser && getLocalStorageItem("access_token") ? (
            <div
              className="MessagesBlock"
              onScroll={scrollHandler}
              ref={messagesRef}
            >
              {isFetching && <Spiner className="ChatSpinner" />}
              {messages.length > 0 ? (
                <RenderMessages
                  userUTCOffset={userUTCOffset}
                  messages={messages}
                />
              ) : (
                <div className="notMessages">{t("chat.got_questions")}</div>
              )}
              <div ref={chatBlockRef}></div>
            </div>
          ) : (
            <div className="UnLoggedMessage">
              <p>
                {t("chat.please")}{" "}
                <CustomLink href="/login">{t("chat.log_in")}</CustomLink>{" "}
                {t("chat.to_send_a_message")}
              </p>
            </div>
          )}
        </div>
        <TypingArea
          disabled={!loggedUser}
          onSubmit={sendMessageHandler}
          maxLength={200}
          value={writtenMessage}
          onChange={changeMessageHandler}
          keyDownHandle={keyDownHandle}
        />
      </div>

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
        {isOpen && <ProfileArrowIcon />}
      </div>
    </div>
  );
};
