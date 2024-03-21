import { images } from "@/utils/imagesConstant";
import { useSelector } from "react-redux";
import classNames from "classnames";
import Image from "next/image";
import { CustomLink } from "../Link/Link";

const ProfileBack = ({ showOnDesktop, back }) => {
  const isTablet = useSelector((state) => state.isTablet);

  // in the mobile version we should navigate to sidebar menu when user clicks back
  const backRoute = isTablet ? "/settings" : "/settings/profile";

  return (
    <div
      className={classNames("d-flex", {
        "d-none": !showOnDesktop && !isTablet,
      })}
    >
      <div className="d-flex">
        <CustomLink href={back || backRoute}>
          <Image
            src={images.goBackArrow}
            alt="Go back"
            className="ms-0 mb-3"
            height={16}
            width={16}
          />
        </CustomLink>
      </div>
    </div>
  );
};

export default ProfileBack;
