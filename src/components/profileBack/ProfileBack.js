import { images } from "@/utils/imagesConstant";
import { useSelector } from "react-redux";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";

const ProfileBack = ({
  showOnDesktop,
  back,
}) => {
  const isTablet = useSelector((state) => state.isTablet);

  // in the mobile version we should navigate to sidebar menu when user clicks back
  const backRoute = isTablet
    ? '/profile'
    : '/profile/profile'

  return (
    <div
      className={classNames('d-flex', {
        'd-lg-none': !showOnDesktop
      })}
    >
      <div className="d-flex">
        <Link href={back || backRoute}>
          <Image
            src={images.goBackArrow}
            alt="Go back"
            className="ms-0 mb-3"
          />
        </Link>
      </div>
    </div>
  )
}

export default ProfileBack;
