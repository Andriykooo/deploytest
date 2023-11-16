import styled from "styled-components";

export const ProfileCard = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: ${(props) =>
    props.active
      ? "var(--global-color-sidebar-field-selected)"
      : "var(--global-color-sidebar-selection)"};
  box-sizing: border-box;
  padding-right: 1rem;
  border-left: ${(props) =>
    props.active
      ? `6px solid var(--global-color-sidebar-field-selected-sideline)`
      : "6px solid transparent"};
`;
export const SidebarProfile = styled.div`
  background: var(--global-color-sidebar-selection);
  width: ${(props) => (props.isOpen ? "240px" : "70px")};
  height: ${(props) => {
    let height = 74;

    if (props.chatIsActive) {
      height = height + 71;
    }

    if (props.noVerified) {
      height = height + 34;
    }

    return `calc(100% - ${height}px);`;
  }}
    
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  & > div {
    border-bottom: 1px solid var(--global-color-sidebar-background);
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
  background: var(--global-color-sidebar-selection);
  padding-right: 0 !important;
  width: ${(props) => (props.sideBarMenu ? " 402px" : "402px")};
  height: calc(100% - 74px);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-scrollbar: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border-bottom: 1px solid var(--global-color-sidebar-background) !important;
  top: 74px;
  @media screen and (max-width: 1024px) {
    height: calc(100% - 56px);
    position: fixed;
    width: 100%;
    z-index: 99;
    top: 56px;
    right: 0;
    padding: 0 !important;
  }
`;
