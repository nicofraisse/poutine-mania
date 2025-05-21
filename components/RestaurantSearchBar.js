import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRestaurantSearch } from "./context/RestaurantSearchProvider";
import { useGet } from "../lib/useAxios";
import { getUrlQueryString } from "../lib/getUrlqueryString";
import { Map, MapPin, Search, XCircle } from "react-feather";
import { Image } from "./Image";
import { Image as ImageIcon } from "react-feather";
import classNames from "classnames";
import Button from "./Button";
import { isMobile } from "react-device-detect";
import { SurpriseButton } from "./SurpriseButton";
import RestaurantIntrouvable from "./RestaurantIntrouvable";
import { useTranslation } from "next-i18next";

const RestaurantSearchBar = React.forwardRef(({ onSubmit, isBanner }, ref) => {
  const { push, asPath } = useRouter();
  const { searchValue, setSearchValue, nonDebouncedValue } =
    useRestaurantSearch();
  const { t } = useTranslation();
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const { data: restaurants } = useGet(
    `/api/restaurants${getUrlQueryString({
      search: searchValue?.trim(),
      sort: "reviewCount",
      order: -1,
      limit: 6,
    })}`
  );

  const inputRef = useRef();
  const restaurantsRef = useRef(restaurants);

  const handleSearch = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setShowSearchSuggestions(false);
    }, 200);

    const trimmed = e.target?.value?.trim() || searchValue;
    push(
      trimmed
        ? `/restaurants?search=${encodeURIComponent(trimmed)}`
        : `/restaurants`
    );
    onSubmit?.();
  };

  useEffect(() => {
    inputRef.current.addEventListener("keydown", handleKeyDown);

    const onFocus = (e) => {
      setShowSearchSuggestions(true);

      if (isBanner && isMobile) {
        e.preventDefault();
        const top =
          inputRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 136, behavior: "smooth" });
        setTimeout(() => inputRef.current.focus(), 500);
      }
    };

    inputRef.current.addEventListener("focus", onFocus);

    return () => {
      inputRef.current?.removeEventListener("keydown", handleKeyDown);
      inputRef.current?.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => setHighlightedIndex(-1), [searchValue]);
  useEffect(() => {
    restaurantsRef.current = restaurants;
  }, [restaurants]);

  const handleKeyDown = (e) => {
    const list = restaurantsRef.current || [];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i < list.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i > 0 ? i - 1 : list.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex > -1) {
        push(`/restaurants/${list[highlightedIndex].slug}`);
        setShowSearchSuggestions(false);
      } else {
        handleSearch(e);
      }
    } else if (e.key === "Escape") {
      setShowSearchSuggestions(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSearchSuggestions(false), 50);
  };

  const parts = asPath.split("/");
  const isRestaurantsPath = parts[parts.length - 1]?.includes("restaurants");

  return (
    <form
      className="relative grow sm:ml-6 mr-1 lg:mx-0"
      ref={ref}
      onBlur={handleBlur}
    >
      <div className="relative">
        <input
          className={classNames("w-full", {
            "border-2 border-slate-300 rounded-md py-[8px] px-10 text-sm font-bold ":
              !isBanner,
            "py-4 px-12 rounded-full border-slate-300 shadow-md": isBanner,
          })}
          placeholder={t("restaurantSearchbar.placeholder")}
          value={nonDebouncedValue ?? ""}
          onChange={(e) => {
            setShowSearchSuggestions(true);
            setSearchValue(e.target.value);
          }}
          ref={inputRef}
        />

        {isBanner && (
          <div className="absolute right-1 top-1 hidden xs:block">
            <Button
              onClick={handleSearch}
              width="smd"
              height="smd"
              className="ml-3 shadow-md"
              rounded
            >
              <Map className="mr-2 xs:mr-3" />
              <span className="hidden xs:inline">{t("button.explore")}</span>
            </Button>
          </div>
        )}

        <Search
          className={classNames({
            "absolute top-2 left-2 text-slate-400 cursor-pointer hover:text-slate-500 transition duration-300":
              !isBanner,
            "absolute top-4 left-4 text-slate-500": isBanner,
          })}
          onClick={handleSearch}
        />
        {nonDebouncedValue.length > 1 && (
          <XCircle
            className={classNames("cursor-pointer", {
              "absolute top-2 right-2 text-slate-400 hover:text-slate-500 transition duration-300":
                !isBanner,
              "absolute top-3 right-4 text-slate-400": isBanner,
            })}
            onClick={() => {
              setSearchValue("");
              if (!isMobile) inputRef.current.focus();
            }}
          />
        )}
      </div>

      {!isRestaurantsPath && showSearchSuggestions && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className={classNames(
            "absolute z-50 w-full bg-white border shadow-lg left-0 px-1 xs:px-2 sm:px-3 py-2",
            { "rounded-xl": isBanner }
          )}
        >
          {restaurants?.map((r, idx) => {
            const img = r.reviews?.find((res) => res.photos?.[0])?.photos[0];
            return (
              <div
                className={classNames(
                  "p-2 sm:p-3 hover:bg-slate-100 cursor-pointer flex items-center border-b",
                  { "bg-slate-100": highlightedIndex === idx }
                )}
                key={r._id}
                onMouseDown={() => push(`/restaurants/${r.slug}`)}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                {img ? (
                  <Image
                    src={img}
                    alt={`${r.name}-photo`}
                    className="w-10 h-8 sm:w-12 sm:h-10 rounded object-cover object-center"
                  />
                ) : (
                  <div className="w-10 h-8 sm:w-12 sm:h-10 flex justify-center items-center">
                    <ImageIcon
                      className="text-slate-300"
                      size={32}
                      alt="placeholder"
                    />
                  </div>
                )}
                <div className="pl-3">
                  <div className="text-sm font-bold">{r.name}</div>
                  <div className="text-xs text-slate-400">
                    <MapPin size={12} className="inline mt-[-2px]" />{" "}
                    {r.succursales.length === 1
                      ? r.succursales[0].address.place_name.split(", Q")[0]
                      : t("restaurantSearchbar.multipleBranches", {
                          count: r.succursales.length,
                        })}
                  </div>
                </div>
              </div>
            );
          })}
          {isBanner ? (
            <>
              <RestaurantIntrouvable />
              <div className="text-center py-3 flex items-center justify-center text-sm xs:text-base">
                <Button
                  width="smd"
                  height="smd"
                  className="mr-3"
                  onClick={handleSearch}
                >
                  <Search className="mr-2" />
                  {t("restaurantSearchbar.search")}
                </Button>
                <SurpriseButton />
              </div>
            </>
          ) : (
            <div
              className="hover:bg-slate-100 cursor-pointer flex items-center text-slate-600 font-light p-4 text-sm sm:text-base"
              onClick={handleSearch}
            >
              <Search className="text-slate-500 mr-2" size={20} />
              {searchValue.length > 2
                ? t("restaurantSearchbar.viewResultsFor", { term: searchValue })
                : t("restaurantSearchbar.viewAllRestaurants")}
            </div>
          )}
        </div>
      )}
    </form>
  );
});

RestaurantSearchBar.displayName = "RestaurantSearchBar";

export default RestaurantSearchBar;
