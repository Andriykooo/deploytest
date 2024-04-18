"use client";

import { setLanguage } from "@/store/actions";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useClickOutside } from "../../hooks/useClickOutside";
import { ArrowIcon } from "@/icons/ArrowIcon";
import { LanguageIcon } from "@/icons/LanguageIcon";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import classNames from "classnames";
import { CustomCookie } from "@/utils/cookie";
import { addLocalStorageItem } from "@/utils/localStorage";
import "./languageDropdown.css";

const LanguageDropdown = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const params = useParams();
  const dropdownLangRef = useRef(null);

  const language = useSelector((state) => state.language);
  const onboarding = useSelector((state) => state.on_boarding);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const languageSelectHandler = (selectedLanguage) => {
    dispatch(setLanguage(selectedLanguage));

    CustomCookie.set("language", selectedLanguage.code2.toLowerCase());
    addLocalStorageItem("language", selectedLanguage.code2.toLowerCase());
    toggleDropdown();

    window.location.href = pathname.replace(
      `/${params.lng}`,
      `/${selectedLanguage.code2.toLowerCase()}`
    );
  };

  useClickOutside(dropdownLangRef, () => {
    setIsOpen(false);
  });

  if (onboarding.languages?.length <= 1) {
    return null;
  }

  return (
    <div className="dropdown-lang-container" ref={dropdownLangRef}>
      <ul className="dropdown-lang-list">
        {isOpen &&
          onboarding.languages?.map((language) => {
            if (language.code2.toLowerCase() === params.lng) {
              return null;
            }

            return (
              <li
                key={language?.code2}
                className="dropdown-lang-item"
                onClick={() => languageSelectHandler(language)}
              >
                <div className="dropdown-lang-item-link">
                  <LanguageIcon />
                  {language?.language_name}
                </div>
              </li>
            );
          })}
      </ul>
      <button
        className="dropdown-lang-btn dropdown-lang-item"
        onClick={toggleDropdown}
      >
        <div>
          <LanguageIcon />
          {language?.language_name}
        </div>
        <ArrowIcon className={classNames({ "lang-opened": !isOpen })} />
      </button>
    </div>
  );
};

export default LanguageDropdown;
