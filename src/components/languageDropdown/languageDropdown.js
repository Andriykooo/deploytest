import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useClickOutside } from "../../hooks/useClickOutside";
import { setLanguage } from "../../store/actions";
import "./languageDropdown.css";
import Image from "next/image";

const LanguageDropdown = () => {
  const dispatch = useDispatch();

  const language = useSelector((state) => state.language);
  const onboarding = useSelector((state) => state.on_boarding);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownLangRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const languageSelectHandler = (selectedLanguage) => {
    dispatch(setLanguage(selectedLanguage));
    toggleDropdown();
  };

  useClickOutside(dropdownLangRef, () => {
    setIsOpen(false);
  });

  return (
    <div className="dropdown-lang-container" ref={dropdownLangRef}>
      <button
        className={`dropdown-lang-btn dropdown-lang-item ${
          isOpen ? "lang-opened" : ""
        }`}
        onClick={toggleDropdown}
      >
        <div>
          <Image
            className="dropdown-lang-flag"
            src={language?.flag_url}
            alt="flag"
            height={20}
            width={20}
          />
          {language?.language_name}
        </div>
      </button>
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
                <Image
                  className="dropdown-lang-flag"
                  src={language.flag_url}
                  alt="flag"
                  height={20}
                  width={20}
                />
                {language?.language_name}
              </li>
            ))}
      </ul>
    </div>
  );
};

export default LanguageDropdown;
