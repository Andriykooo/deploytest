"use client";

import { setLanguage } from "@/store/actions";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useClickOutside } from "../../hooks/useClickOutside";
import "./languageDropdown.css";
import { LanguageIcon } from "@/utils/icons";

const LanguageDropdown = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const dropdownLangRef = useRef(null);

  const language = useSelector((state) => state.language);
  const onboarding = useSelector((state) => state.on_boarding);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const languageSelectHandler = (selectedLanguage) => {
    dispatch(setLanguage(selectedLanguage));
    toggleDropdown();
    Cookies.set("language", selectedLanguage.code2.toLowerCase());
    window.location.reload();
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
          onboarding.languages
            ?.filter(
              (filterLanguage) => filterLanguage?.code2 !== language?.code2
            )
            ?.map((language) => (
              <li
                className="dropdown-lang-item"
                key={language?.code2}
                onClick={() => languageSelectHandler(language)}
              >
                <LanguageIcon />
                {language?.language_name}
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
