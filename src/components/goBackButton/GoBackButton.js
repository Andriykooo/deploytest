import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import { useRouter } from "next/navigation";

export const GoBackButton = ({ link }) => {
  const router = useRouter();

  const handleLink = () => {
    if (link) {
      router.push(link);
    } else {
      router.back();
    }
  };

  return (
    <div onClick={handleLink} className="goBackButton">
      <Image src={images.arrowIcon} alt="Go back" className="goBackArrow" height={14} width={14} />
      <span>Go Back</span>
    </div>
  );
};
