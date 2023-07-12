import Image from "next/image";
import { useRouter } from "next/navigation";
import { images } from "../../utils/imagesConstant";

export const GoBackButton = () => {
  const router = useRouter();

  return (
    <div className=" goBackStyle">
      <Image
        src={images.goBackArrow}
        alt="Go back"
        className="goBackArrow"
        onClick={() => router.push("/profile")}
      />
      <p className="goBack" onClick={() => router.push("/profile")}>
        Go Back
      </p>
    </div>
  );
};
