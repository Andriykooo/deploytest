import styled from "styled-components";
import { theme } from "../../utils/config";

export const HeaderDiv = styled.div`
  span {
    color: ${(props) =>
      props.active
        ? `${theme?.colors?.mainTertiary} !important`
        : theme?.colors?.colorTextPrimary};
    text-align: center;
  }
  svg {
    fill: ${(props) =>
      props.active
        ? `${theme?.colors?.mainTertiary} !important`
        : theme?.colors?.colorTextPrimary};
  }
  path {
    fill: ${(props) =>
      props.active
        ? `${theme?.colors?.mainTertiary} !important`
        : theme?.colors?.colorTextPrimary};
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
