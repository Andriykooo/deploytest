import styled from "styled-components";
import { theme } from "../../utils/config";

export const HeaderDiv = styled.div`
  span {
    color: ${(props) =>
    props.active
      ? `var(--global-color-header-text-active) !important`
      : `var(--global-color-header-text)`};
    text-align: center;
  }
  svg {
    display: none;

    fill: ${(props) =>
    props.active
      ? `var(--global-color-header-icons-active) !important`
      : `var(--global-color-header-icons)`};
  }
  path {
    fill: ${(props) =>
    props.active
      ? `var(--global-color-header-icons-active) !important`
      : `var(--global-color-header-icons)`};
  }

  img {
    height: 15px;
    width: 15px;
    cursor: pointer;
    filter: ${(props) =>
    props.active
      ? "invert(58%) sepia(55%) saturate(502%) hue-rotate(3deg) brightness(92%) contrast(86%);"
      : ""};
  }

  &:hover {
    img {
      filter: invert(58%) sepia(55%) saturate(502%) hue-rotate(3deg)
        brightness(92%) contrast(86%);
    }
  }

  @media (max-width: 600px) {
    img {
      height: 22px;
      width: 22px;
    }
  }
`;
