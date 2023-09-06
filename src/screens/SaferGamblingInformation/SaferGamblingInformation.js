"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { GoBackButton } from "@/components/goBackButton/GoBackButton";

const SaferGamblingInformation = () => {
  const [pageContent, setPageContent] = useState("");
  const router = useRouter();

  const saferGamblingInfo = () => {
    apiServices
      .get(`${apiUrl.PAGE_CONTENT}?type=more_safer_gambling_info`)
      .then((data) => {
        setPageContent(data?.content);
      });
  };

  function createMarkup() {
    return { __html: pageContent };
  }

  useEffect(() => {
    saferGamblingInfo();
  }, []);

  return (
    <div className="depositLimit">
      <div className="d-flex pb-3">
        <Image
          src={images.goBackArrow}
          alt="Go back"
          className="ms-0"
          onClick={() => router.push("/profile/safer_gambling")}
        />
      </div>
      <p className="menuTitle arrow-title">Safer Gambling Information</p>
      {!pageContent ? (
        <Loader />
      ) : (
        <div className="safer-gambling-information pe-3">
          <div dangerouslySetInnerHTML={createMarkup()}></div>
        </div>
      )}
    </div>
  );
};

export default SaferGamblingInformation;
