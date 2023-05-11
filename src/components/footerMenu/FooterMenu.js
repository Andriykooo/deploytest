import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import { theme } from "../../utils/config";
import { HeaderDiv } from "../header/HeaderDiv";

const FooterParent = styled.div`
  position: ${(props) => (props.sticky ? "sticky" : "fixed")};
  bottom: 0%;
  left: 0%;
  right: 0%;
  background: ${theme?.colors?.shade5};
  height: 80px;
  z-index: 999;
  box-shadow: 0px -1px 20px rgba(0, 0, 0, 0.75);
  @media screen and (min-width: 992px) {
    display: none;
    background: ${theme?.colors?.shade5};
  }
`;

const FooterMenu = ({ page, sticky, data, onClick }) => {
  const router = useRouter();

  return (
    <FooterParent sticky={sticky}>
      <div className="footerIconsDiv">
        {data?.map((item, index) => {
          return (
            <div key={index} data-id={index} className="footerMenuIcon ">
              <HeaderDiv
                active={item.path && router.pathname.includes(item.path)}
                className={
                  item.path === page ? "header-link active" : "header-link"
                }
                style={{
                  justifyContent: "center",
                }}
              >
                <Image
                  onError={(e) => {
                    e.target.style.opacity = "0";
                  }}
                  src={item.icon}
                  alt=""
                />
                <div
                  className="ps-1 sports-header-link"
                  onClick={() => {
                    onClick(item);
                  }}
                >
                  <span className="footerSport">{item.name}</span>
                </div>
              </HeaderDiv>
            </div>
          );
        })}
      </div>
    </FooterParent>
  );
};

export default FooterMenu;
