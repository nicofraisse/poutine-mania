import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRestaurantSearch } from "./context/RestaurantSearchProvider";
import { useGet } from "../lib/useAxios";
import { getUrlQueryString } from "../lib/getUrlqueryString";
import { MapPin, Search, X, XCircle } from "react-feather";
import { Image } from "./Image";
import { Image as ImageIcon } from "react-feather";
import classNames from "classnames";
import Button from "./Button";
import { isMobile } from "react-device-detect";
import { SurpriseButton } from "./SurpriseButton";
import { isMotionValue } from "framer-motion";

const RestaurantSearchBar = React.forwardRef(({ onSubmit, isBanner }, ref) => {
  const { push, asPath } = useRouter();
  const { searchValue, setSearchValue, nonDebouncedValue } =
    useRestaurantSearch();
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

    const trimmedSearchValue = e.target?.value?.trim();
    push(
      trimmedSearchValue
        ? `/restaurants?search=${encodeURIComponent(trimmedSearchValue)}`
        : `/restaurants`
    );
    onSubmit && onSubmit();
  };

  useEffect(() => {
    if (isMobile) {
      const inputElement = inputRef.current;
      inputElement.addEventListener("touchstart", handleFocus);
    }
    inputRef.current.addEventListener("keydown", handleKeyDown);

    const handleInputFocus = (e) => {
      setShowSearchSuggestions(true);

      if (isBanner && isMobile) {
        e.preventDefault();
        const inputElement = inputRef.current;

        const inputTopPosition =
          inputElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: inputTopPosition - 136,
          behavior: "smooth",
        });
        setTimeout(() => {
          inputElement.focus();
        }, 500);
      }
    };

    inputRef.current.addEventListener("focus", handleInputFocus);

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("keydown", handleKeyDown);
        inputRef.current.removeEventListener("focus", handleInputFocus);
      }
    };
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchValue]);

  useEffect(() => {
    restaurantsRef.current = restaurants;
  }, [restaurants]);

  const handleKeyDown = (e) => {
    const restaurantsData = restaurantsRef.current;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < (restaurantsData?.length ?? 0) - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : (restaurantsData?.length ?? 0) - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex > -1) {
        push(`/restaurants/${restaurants[highlightedIndex].slug}`);
        setShowSearchSuggestions(false);
      } else {
        handleSearch(e);
      }
    } else if (e.key === "Escape") {
      setShowSearchSuggestions(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSearchSuggestions(false);
    }, 50);
  };

  const handleFocus = (e) => {
    // setShowSearchSuggestions(true);
    // if (isBanner && isMobile) {
    //   e.preventDefault();
    //   const inputElement = inputRef.current;
    //   const inputTopPosition =
    //     inputElement.getBoundingClientRect().top + window.scrollY;
    //   window.scrollTo({
    //     top: inputTopPosition - 136,
    //     behavior: "smooth",
    //   });
    //   setTimeout(() => {
    //     inputElement.focus();
    //   }, 500);
    // }
  };
  const urlArray = asPath.split("/");
  const isRestaurantsPath =
    urlArray[urlArray.length - 1].includes("restaurants");

  return (
    <form
      className="relative grow sm:ml-6 mr-1 lg:mx-0"
      ref={ref}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className={"relative"}>
        <input
          className={classNames("w-full", {
            "border-2 border-slate-300 rounded-md py-[8px] px-10 text-sm font-bold ":
              !isBanner,
            "py-3 px-12 rounded-full border-slate-300 shadow-md": isBanner,
          })}
          placeholder="Rechercher une poutinerie"
          value={nonDebouncedValue ?? ""}
          onChange={(e) => {
            setShowSearchSuggestions(true);
            setSearchValue(e.target.value);
          }}
          ref={inputRef}
        />

        <Search
          className={classNames({
            "absolute top-2 left-2 text-slate-400 cursor-pointer hover:text-slate-500 transition duration-300":
              !isBanner,
            "absolute top-3 left-4 text-slate-500": isBanner,
          })}
          onClick={handleSearch}
        />
        {nonDebouncedValue.length > 1 && (
          <XCircle
            className={classNames("cursor-pointer", {
              "absolute top-2 right-2 text-slate-400 cursor-pointer hover:text-slate-500 transition duration-300":
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
      {!isRestaurantsPath &&
        showSearchSuggestions &&
        restaurants &&
        (!isBanner || (isBanner && restaurants.length > 0)) && (
          <div
            className={classNames(
              "absolute z-50 w-full bg-white border shadow-lg left-0 px-2 sm:px-3 py-2",
              {
                "rounded-xl": isBanner,
              }
            )}
          >
            {restaurants?.map((r, index) => {
              const image = r.reviews?.find((res) => res.photos?.[0])
                ?.photos[0];

              return (
                <div
                  className={classNames(
                    "p-2 sm:p-3 hover:bg-slate-100 cursor-pointer flex items-center border-b",
                    {
                      "bg-slate-100": highlightedIndex === index,
                    }
                  )}
                  key={r._id}
                  onMouseDown={() => {
                    push(`/restaurants/${r.slug}`);
                  }}
                  onMouseEnter={() => {
                    setHighlightedIndex(index);
                  }}
                >
                  {image ? (
                    <Image
                      src={image}
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
                    <div className="text-xs  text-slate-400">
                      <MapPin size={12} className="inline mt-[-2px]" />{" "}
                      {r.succursales.length === 1
                        ? r.succursales[0].address.place_name.split(", Q")[0]
                        : `${r.succursales.length} adresses au Québec`}
                    </div>
                  </div>
                </div>
              );
            })}
            {isBanner ? (
              <div className="text-center py-3">
                <Button width="smd" height="smd" className="mr-3">
                  Rechercher
                </Button>
                <SurpriseButton />
              </div>
            ) : (
              <div
                className="hover:bg-slate-100 cursor-pointer flex items-center text-slate-600 font-light p-4 text-sm sm:text-base"
                onClick={handleSearch}
              >
                <Search className="text-slate-500 mr-2" size={20} /> Voir tous
                les{" "}
                {searchValue.length > 2
                  ? `résultats pour "${searchValue}"`
                  : "restaurants"}
              </div>
            )}
          </div>
        )}
    </form>
  );
});

RestaurantSearchBar.displayName = "RestaurantSearchBar";

export default RestaurantSearchBar;
