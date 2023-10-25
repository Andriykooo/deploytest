"use client";

import { setLanguage } from "@/store/actions";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useClickOutside } from "../../hooks/useClickOutside";
import { LanguageIcon } from "@/utils/icons";
import { useClientPathname } from "@/hooks/useClientPathname";
import "./languageDropdown.css";
import { useParams } from "next/navigation";
import { locales } from "../../../i18n";

const LanguageDropdown = () => {
  const dispatch = useDispatch();
  const { pathname } = useClientPathname();
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
    toggleDropdown();
    window.location.href = `/${selectedLanguage.code2.toLowerCase()}${pathname}`;
  };

  useClickOutside(dropdownLangRef, () => {
    setIsOpen(false);
  });

  if (onboarding.languages?.length <= 1) {
    return null;
  }

  useEffect(() => {
    if (onboarding?.languages) {
      const lng = params.lng.toUpperCase();

      dispatch(
        setLanguage(
          onboarding.languages.find((language) => language.code2 === lng)
        )
      );
    }
  }, [onboarding]);

  return (
    <div className="dropdown-lang-container" ref={dropdownLangRef}>
      <ul className="dropdown-lang-list">
        {isOpen &&
          onboarding.languages
            ?.filter((filterLanguage) => {
              return (
                filterLanguage?.code2 !== language?.code2 &&
                locales.includes(filterLanguage.code2?.toLowerCase())
              );
            })
            ?.map((language) => (
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
