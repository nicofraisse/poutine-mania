import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import Dropdown from "./Dropdown"; // adjust path if needed

export const LanguageSwitch = ({ isHomepage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleRef = useRef(null);
  const { locale, pathname, asPath, query, push } = useRouter();

  const options = [
    { code: "fr", label: "Français 🇫🇷" },
    { code: "en", label: "English 🇬🇧" },
  ];

  const changeLocale = (newLocale) => {
    setDropdownOpen(false);
    push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className="relative z-50">
      <button
        ref={toggleRef}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={classNames(
          "flex items-center px-3 bg-none hover:bg-gray-400 hover:bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500 transition duration-150 ease-in-out",
          isHomepage
            ? "h-[48px] xs:h-[52px] text-white"
            : "h-[36px] xs:h-[40px] text-gray-900"
        )}
      >
        <span className="mr-2 text-sm">{locale === "fr" ? "FR" : "EN"}</span>
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={dropdownOpen}
        setIsOpen={setDropdownOpen}
        toggleRef={toggleRef}
      >
        {options.map(({ code, label }, i) => (
          <div
            key={code}
            onClick={() => changeLocale(code)}
            className={classNames(
              "hover:bg-gray-100 px-3 py-2 text-gray-700 cursor-pointer",
              {
                "rounded-t-lg": i === 0,
                "rounded-b-lg": i === options.length - 1,
              }
            )}
          >
            {label}
          </div>
        ))}
      </Dropdown>
    </div>
  );
};
