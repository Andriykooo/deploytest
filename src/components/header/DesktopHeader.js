import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSport } from "../../store/actions";
import { images } from "../../utils/imagesConstant";
import { HeaderDiv } from "./HeaderDiv";
import { DesktopLoggedUser } from "./logged/DesktopLoggedUser";
import { DesktopUnloggedUser } from "./unlogged/DesktopUnloggedUser";

export const DesktopHeader = ({ showBetSlip, data, onClick }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const loggedUser = useSelector((state) => state.loggedUser);

  return (
    <>
      <div
        className="justify-content-between d-flex align-items-center gap-3"
        style={{ height: "inherit" }}
      >
        <div className="swifty-gaming">
          <Link href="/home">
            <Image
              alt="img-GroupSwifty"
              src={images.GroupSwifty}
              onClick={() => dispatch(setActiveSport("0"))}
            />
          </Link>
        </div>
        <div className="container-nav-links">
          <div className="navBarLinks">
            {data?.map((item, index) => {
              return (
                <HeaderDiv
                  key={index}
                  data-id={index}
                  active={item?.path && router.pathname.includes(item.path)}
                  className={"header-link active"}
                >
                  {item?.icon && <img src={item.icon} alt="" />}
                  <div
                    className="ps-1 sports-header-link"
                    onClick={() => {
                      onClick?.(item);
                    }}
                  >
                    <span>{item.name}</span>
                  </div>
                </HeaderDiv>
              );
            })}
          </div>
        </div>
        {!loggedUser?.user_data ? (
          <DesktopUnloggedUser showBetSlip={showBetSlip} />
        ) : (
          <DesktopLoggedUser showBetSlip={showBetSlip} />
        )}
      </div>
    </>
  );
};
