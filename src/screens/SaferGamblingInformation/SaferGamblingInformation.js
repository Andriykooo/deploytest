"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { Loader } from "../../components/loaders/Loader";
import ProfileMenu from "../../components/profileMenu/ProfileMenu";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";

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
    <>
      <Header />
      <div className="backgroundLinear">
        <div className="d-none d-lg-block">
          <ProfileMenu sideBarMenu page="safer_gambling" active={"active"} />
        </div>
        <div className="depositLimit">
          <div className="d-flex arrow-top">
            <Image
              src={images.goBackArrow}
              alt="Go back"
              className="goBackArrow ms-0 mb-3"
              onClick={() => router.back()}
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
      </div>
    </>
  );
};

export default SaferGamblingInformation;
