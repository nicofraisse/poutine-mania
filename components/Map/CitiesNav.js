import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useTranslation } from "next-i18next";

const buttonColors = ["teal", "cyan", "stone"];
// needed for tailwing purge
const colorClasses = {
  teal: "bg-teal-500 hover:bg-teal-700",
  cyan: "bg-cyan-500 hover:bg-cyan-700",
  stone: "bg-stone-500 hover:bg-stone-700",
};

const CitiesNav = ({ onSelect, cities }) => {
  const scrollRef = useRef(null);
  const { t } = useTranslation();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const buffer = 16;
    setCanScrollLeft(scrollLeft > buffer);
    setCanScrollRight(scrollLeft + clientWidth + buffer < scrollWidth);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      if (el) el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = (el.clientWidth / 2) * (direction === "left" ? -1 : 1);
    el.scrollTo({ left: el.scrollLeft + delta, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-visible py-1">
      {canScrollLeft && (
        <button
          aria-label="Scroll left"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 p-1 bg-white rounded-full shadow"
        >
          <ChevronLeft />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={updateScrollButtons}
        className="flex space-x-2 overflow-x-auto scrollbar-hide py-2 px-4 pr-16"
      >
        {cities.map((city, idx) => {
          const color = buttonColors[idx % buttonColors.length];
          return (
            <button
              key={city.key}
              onClick={() => onSelect(city)}
              className={classNames(
                `text-white font-bold py-2 px-4 rounded-md shadow-md flex-shrink-0`,
                colorClasses[color]
              )}
            >
              {t(city.labelKey)}
            </button>
          );
        })}
      </div>

      {canScrollRight && (
        <button
          aria-label="Scroll right"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 p-1 bg-white rounded-full shadow"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
};

export default CitiesNav;
