"use client";

import { setLanguage } from "@/store/actions";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useClickOutside } from "../../hooks/useClickOutside";
import { LanguageIcon } from "@/utils/icons";
import { usePathname } from "next/navigation";
import "./languageDropdown.css";
import { useParams } from "next/navigation";
import { addLocalStorageItem } from "@/utils/localStorage";

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

  useEffect(() => {
    if (onboarding) {
      dispatch(
        setLanguage(
          onboarding.languages?.find(
            (lang) => lang.code2.toLowerCase() === params.lng
          )
        )
      );
    }
  }, [onboarding]);

  if (onboarding.languages?.length <= 1) {
    return null;
  }

  return (
    <div className="dropdown-lang-container" ref={dropdownLangRef}>
      <ul className="dropdown-lang-list">
        {isOpen &&
          onboarding.languages?.map((language) => (
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
          ))}
      </ul>
      <button
        className={`dropdown-lang-btn dropdown-lang-item ${
          isOpen ? "lang-opened" : ""
        }`}
        onClick={toggleDropdown}
      >
        <div>
          <LanguageIcon />
          {language?.language_name}
        </div>
      </button>
    </div>
  );
};

export default LanguageDropdown;
