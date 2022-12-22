import React, { useState } from "react";
import Input from "components/Input";
import { useRouter } from "next/router";
import { useRestaurantSearch } from "./context/RestaurantSearchProvider";
import { useGet } from "../lib/useAxios";
import { getUrlQueryString } from "../lib/getUrlqueryString";
import { MapPin, Search } from "react-feather";
import { Image } from "./Image";
import { Image as ImageIcon } from "react-feather";

const RestaurantSearchBar = React.forwardRef(({ onSubmit }, ref) => {
  const { push, asPath, pathname } = useRouter();
  const { searchValue, setSearchValue, nonDebouncedValue } =
    useRestaurantSearch();
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const { data: restaurants, loading: restaurantsLoading } = useGet(
    `/api/restaurants${getUrlQueryString({
      search: searchValue?.trim(),
      sort: "reviewCount",
      order: -1,
      limit: 6,
    })}`
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setShowSearchSuggestions(false);
    }, 200);
    const trimmedSearchValue = nonDebouncedValue?.trim();
    push(
      trimmedSearchValue
        ? `/restaurants?search=${encodeURIComponent(trimmedSearchValue)}`
        : `/restaurants`
    );
    onSubmit && onSubmit();
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSearchSuggestions(false);
    }, 200);
  };
  const handleFocus = () => {
    const urlArray = asPath.split("/");
    if (!urlArray[urlArray.length - 1].includes("restaurants")) {
      setShowSearchSuggestions(true);
    }
  };

  return (
    <form
      className="relative grow sm:ml-6 mr-1 lg:mx-0"
      onSubmit={handleSearch}
      ref={ref}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <Input
        type="text"
        className="font-bold text-sm"
        placeholder="Rechercher une poutine"
        isSearch
        loading={restaurantsLoading}
        handleSearch={handleSearch}
        onChange={(e) => setSearchValue(e.target.value)}
        value={nonDebouncedValue ?? ""}
      />
      {showSearchSuggestions && (
        <div className="absolute z-50 w-full bg-white border shadow-lg left-0 px-2 sm:px-3 py-2">
          {restaurants?.map((r, i) => {
            const image = r.reviews?.find((res) => res.photos?.[0])?.photos[0];

            return (
              <div
                className="p-2 sm:p-3 hover:bg-gray-100 cursor-pointer flex items-center border-b"
                key={r._id}
                onClick={() => push(`/restaurants/${r._id}`)}
              >
                {image ? (
                  <Image
                    publicId={image}
                    alt={`${r.name}-photo`}
                    className="w-10 h-8 sm:w-12 sm:h-10 rounded object-cover object-center"
                  />
                ) : (
                  <div className="w-10 h-8 sm:w-12 sm:h-10 flex justify-center items-center">
                    <ImageIcon
                      className="text-gray-300"
                      size={32}
                      alt="placeholder"
                    />
                  </div>
                )}

                <div className="pl-3">
                  <div className="text-sm font-bold">{r.name}</div>
                  <div className="text-xs  text-gray-400">
                    <MapPin size={12} className="inline mt-[-2px]" />{" "}
                    {r.succursales.length === 1
                      ? r.succursales[0].address.place_name.split(", Q")[0]
                      : `${r.succursales.length} adresses au Québec`}
                  </div>
                </div>
              </div>
            );
          })}
          <div
            className="hover:bg-gray-100 cursor-pointer flex items-center text-gray-600 font-light p-4 text-sm sm:text-base"
            onClick={handleSearch}
          >
            <Search className="text-gray-500 mr-2" size={20} /> Voir tous les{" "}
            {searchValue.length > 2
              ? `résultats pour "${searchValue}"`
              : "restaurants"}
          </div>
        </div>
      )}
    </form>
  );
});

RestaurantSearchBar.displayName = "RestaurantSearchBar";

export default RestaurantSearchBar;
