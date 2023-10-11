import styled from "styled-components";

export const ChatWrapper = styled.div`
  position: fixed;
  z-index: 1000;
  bottom: 0;
  width: ${(props) => (props.isOpen ? "276px" : "70px")};
  box-shadow: -2px -2px 4px 0px #00000040;

  @media (max-width: 1024px) {
    width: auto;
    position: static;
    box-shadow: none;
  }
`;

export const ChatBottomWrapper = styled.div`
  display: flex;
  cursor: pointer;
  width: 100%;
  height: 71px;
  background: var(--global-color-sidebar-selection);
  padding: 17px 26px 17px 18px;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1024px) {
    padding: 0;
    border-radius: 50%;
    height: 32px;
    width: 32px;
  }
`;

export const ChatBottomSubWrapper = styled.div`
  display: flex;
  gap: 12px;
`;
export const ChatIconStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
`;

export const ChatBox = styled.div`
  width: 372px;
  max-height: 563px;
  height: 100%;
  margin-bottom: 3px;
  background: var(--global-color-trader-chat-background);
  font-weight: 400;
  font-size: 16px;
  border-radius: 8px 8px 0px 0px;
  position: fixed;
  bottom: 0;
  left: ${(props) => (props.isOpen ? "279px" : "73px")};
  border: 1px solid var(--global-color-trader-chat-primary);

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: auto;
    width: auto;
    max-height: unset;
    border-radius: 0;
    margin-bottom: 0;
  }
 
`;

export const ChatHeader = styled.div`
  width: 100%;
  background: var(--global-color-trader-chat-primary);
  display: flex;
  justify-content: space-between;
  padding: 19px 18px;
  border-radius: 8px 8px 0px 0px;
  font-weight: 500;
  font-size: 14px;
  color: var(--global-color-trader-chat-primary-text);

  & > span {
    cursor: pointer;
  }

  @media (max-width: 1024px) {
    border-radius: 0;
  }
`;

export const ChattingBlock = styled.div`
  height: ${(props) => `calc(100% - ${props.textareaHeight}px)`};
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;

  @media (max-width: 1024px) {
    height: calc(100% - 169px);
  }

  @media (max-width: 339px) {
    height: calc(100% - 190px);
  }
`;
export const ChatMessage = styled.div`
  max-width: 286px;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${(props) => (props.isRight ? "var(--global-color-trader-chat-bubble2-text)" : "var(--global-color-trader-chat-bubble1-text)")};
  padding: 6px;
  overflow: hidden;
  display: flex;
  text-overflow: ellipsis;
  margin-bottom: 20px;
  background: ${(props) => (props.isRight ? "var(--global-color-trader-chat-bubble2)" : "var(--global-color-trader-chat-bubble1)")};
  white-space: pre-line;
  border-radius: 6px;
`;

export const ChatTitle = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;
  color: var(--global-color-trader-chat-primary-text);
`;

export const MessagesBlock = styled.div`
  height: 100%;
  overflow: scroll;

  @media (max-width: 1024px) {
    height: calc(100vh - 163px);
  }

  & > :first-child {
    margin-top: 14px;
  }
`;

export const NumberNewMessages = styled.div`
  position: absolute;
  right: ${(props) => (props.isOpen ? "54px" : "7px")};
  bottom: ${(props) => (props.isOpen ? "25px" : "40px")};
  width: 20px;
  height: 20px;
  background: ${(props) => (props.isOpen ? "--global-color-sidebar-chat_icon-background" : "var(--global-color-trader-chat-background)")};
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  color: ${(props) => (props.isOpen ? "var(--global-color-trader-chat-primary-text)" : "var(--global-color-trader-chat-primary)")};
`;
