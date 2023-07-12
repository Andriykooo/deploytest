import styled from "styled-components";
import { theme } from "../../utils/config";

export const ChatWrapper = styled.div`
  position: fixed;
  z-index: 1000;
  bottom: 0;
  width: ${(props) => (props.isOpen ? "276px" : "70px")};

  @media (max-width: 991px) {
    width: 100%;
  }
`;

export const ChatBottomWrapper = styled.div`
  display: flex;
  cursor: pointer;
  width: 100%;
  height: 71px;
  background: ${theme?.colors?.mainSecondary};
  padding: 17px 26px 17px 18px;
  justify-content: space-between;
  align-items: center;
`;

export const ChatBottomSubWrapper = styled.div`
  display: flex;
  gap: 12px;
`;
export const ChatIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: #c59e43;
  border-radius: 100%;
`;

export const ChatBox = styled.div`
  width: 372px;
  max-height: 563px;
  height: 100%;
  margin-bottom: 3px;
  background: #ffffff;
  font-weight: 400;
  font-size: 16px;
  border-radius: 8px 8px 0px 0px;
  position: fixed;
  bottom: 0;
  left: ${(props) => (props.isOpen ? "279px" : "73px")};

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
  background: #c59e43;
  display: flex;
  justify-content: space-between;
  padding: 19px 18px;
  border-radius: 8px 8px 0px 0px;
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;

  & > span {
    cursor: pointer;
  }

  @media (max-width: 991px) {
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

  @media (max-width: 991px) {
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
  color: #191919;
  padding: 6px;
  overflow: hidden;
  display: flex;
  text-overflow: ellipsis;
  margin-bottom: 20px;
  background: ${(props) => (props.isRight ? "#EBEBEB" : "#EBE1D2")};
  white-space: pre-line;
  border-radius: 6px;
`;

export const ChatTitle = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;
  color: #ffffff;
`;

export const MessagesBlock = styled.div`
  height: 100%;
  overflow: scroll;

  @media (max-width: 991px) {
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
  background: ${(props) => (props.isOpen ? "#C59E43" : "#FFFFFF")};
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  color: ${(props) => (props.isOpen ? "#FFFFFF" : "#C59E43")};
`;
