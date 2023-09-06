import styled from "styled-components";
import { theme } from "../../utils/config";

export const ProfileCard = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: ${(props) =>
    props.active ? "rgba(188, 146, 57, 0.07)" : "#353A40"};
  margin-left:${(props) => (props.active ? "0" : "8px")}
  box-sizing: border-box;
  padding-right: 1rem;
  border-left: ${(props) =>
    props.active
      ? `6px solid ${theme?.colors?.mainTertiary}`
      : "6px solid transparent"};
`;
export const SidebarProfile = styled.div`
  background: ${theme?.colors?.mainSecondary};
  width: ${(props) => (props.isOpen ? "276px" : "70px")};
  height: ${(props) => (props.chatIsActive ? "calc(100% - 145px)" : "calc(100% - 74px)")};
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  & > div {
    border-bottom: 1px solid #25292d;
  }

  @media (max-width: 1024px) {
    width: 100%;
    height: calc(100% - 56px);
  }
`;
export const SidebarProfilMenu = styled.div`
  background: ${(props) => (props.version ? " transparent !important" : "")};
  position: fixed;
  z-index: 10;
  background: ${theme?.colors?.mainSecondary};
  padding-right: 0 !important;
  width: ${(props) => (props.sideBarMenu ? " 402px" : "402px")};
  height: calc(100% - 74px);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-scrollbar: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border-bottom: 1px solid rgb(37, 41, 45) !important;
  top: 74px;
  @media screen and (max-width: 991px) {
    height: calc(100% - 56px);
    position: fixed;
    width: 100%;
    z-index: 99;
    top: 56px;
    right: 0;
    padding: 0 !important;
  }
`;
