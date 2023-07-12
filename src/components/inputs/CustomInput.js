import styled from "styled-components";

const pxtorem = (px) => px / 16 + "rem";

export const LabelWrapper = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.flexStart ? "flex-start" : "space-between"};
  flex-direction: ${(props) => (props.flexStart ? "row" : "row-reverse")};
  align-items: center;
  margin: 12px 0;
`;

export const Label = styled.label`
  color: ${(props) => (props.warning ? "#F5337C" : "#fff")};
  font-style: normal;
  font-weight: normal;
  font-size: ${pxtorem(16)};
  line-height: ${pxtorem(24)};
  margin-bottom: ${(props) => (props.mb0 ? 0 : pxtorem(5))};
  margin-top: ${(props) => (props.mt ? pxtorem(15) : 0)};
  margin-left: ${(props) => (props.ml0 ? "0" : pxtorem(12))};
  margin-right: ${(props) => (props.mr ? pxtorem(12) : "0")};
  text-align: ${(props) =>
    props.center ? "center" : props.right ? "right" : "left"};
  font-weight: ${(props) => (props.bold ? 600 : 400)};
  display: block;
  opacity: ${(props) => (props.blur ? 0.3 : 1)};
`;
