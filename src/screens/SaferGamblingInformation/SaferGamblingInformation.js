"use client";

import { useEffect, useState } from "react";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import { useTranslations } from "@/hooks/useTranslations";
import "../SaferGambling/SaferGambling.css";

const SaferGamblingInformation = () => {
  const t = useTranslations("safer_gambling_information");
  const [pageContent, setPageContent] = useState("");

  const saferGamblingInfo = () => {
    apiServices
      .get(`${apiUrl.PAGE_CONTENT}?type=more-safer-gambling-info`)
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
      <PreferencesTitle
        title={t("safer_gambling_information")}
        backRoute="/settings/safer_gambling"
        marginBottomSize="sm"
        showBackOnDesktop
      />
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
