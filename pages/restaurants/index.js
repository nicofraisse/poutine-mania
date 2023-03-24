import { useState } from "react";

import Map from "components/Map";
import RestaurantCard from "../../components/RestaurantCard";
import { useRestaurantSearch } from "components/context/RestaurantSearchProvider";
import { useGet } from "lib/useAxios";
import { RestaurantCardHoverProvider } from "components/context/RestaurantCardHoverProvider";
import ReactSelect from "react-select";
import { Sliders, X } from "react-feather";
import Button from "components/Button";
import useClickOutside from "../../lib/useClickOutside";
import classNames from "classnames";
import { getUrlQueryString } from "../../lib/getUrlqueryString";
import { useRouter } from "next/router";
import RestaurantIntrouvable from "../../components/RestaurantIntrouvable";
import { flatten } from "lodash";
import Skeleton from "react-loading-skeleton";

const sortTypes = [
  { label: "Popularité", value: "reviewCount" },
  { label: "Nom", value: "name" },
  { label: "Note moyenne", value: "avgRating" },
  // { label: 'Date de création', value: 'createdAt' },
  // { label: 'Proximité', value: 'proximity' },
];

const sortOrders = [
  { label: "Décroissant", value: -1 },
  { label: "Croissant", value: 1 },
];

const Restaurants = () => {
  const { searchValue, nonDebouncedValue } = useRestaurantSearch();
  const [sortType, setSortType] = useState("reviewCount");
  const [sortOrder, setSortOrder] = useState(-1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useClickOutside(() => setFiltersOpen(false));
  const { push } = useRouter();

  const { data: restaurants, loading: restaurantsLoading } = useGet(
    `/api/restaurants${getUrlQueryString({
      search: searchValue && encodeURIComponent(searchValue.trim()),
      sort: sortType,
      order: sortOrder,
      noUnapproved: true,
    })}`
  );

  const allSuccursales =
    restaurants && flatten(restaurants.map((r) => r.succursales));
  // const loading = searchValue !== nonDebouncedValue || restaurantsLoading;

  return (
    <RestaurantCardHoverProvider>
      <div className="flex w-full flex-col md:flex-row-reverse h-screen-minus-navbar">
        <div className="grow md:w-1/2 min-h-1/2vh max-h-1/2vh md:min-h-screen-minus-navbar md:max-h-screen-minus-navbar">
          <Map restaurants={restaurants} />
        </div>
        <div
          className={classNames(
            "pt-5 md:w-1/2 md:max-w-[480px] scrollbar-hide min-h-full",
            {
              "md:overflow-y-auto": restaurants,
              "overflow-hidden": !restaurants,
            }
          )}
        >
          <div className="lg:pl-6 lg:pr-5 px-2 mb-3 lg:mb-0 flex justify-between items-start w-full">
            {!restaurants ? (
              <Skeleton
                width="300px"
                height="24px"
                className="relative top-2"
              />
            ) : (
              <h2
                className="font-bold text-slate-500 text-lg flex items-center h-12 mr-2"
                style={{ lineHeight: 1.3 }}
              >
                {restaurants.length > 0 ? (
                  <>
                    {restaurants.length} poutinerie
                    {restaurants.length > 1 && "s"} • {allSuccursales.length}{" "}
                    addresse
                    {allSuccursales.length > 1 && "s"}{" "}
                  </>
                ) : (
                  "0 résultats "
                )}
                {searchValue && `pour "${searchValue}"`}{" "}
                {searchValue && (
                  <button
                    className="p-1 bg-gray-50 transition duration-150 hover:bg-gray-100 ml-1 rounded"
                    onClick={() => push("/restaurants")}
                  >
                    <X size={18} />
                  </button>
                )}
              </h2>
            )}

            <div className="relative" ref={filtersRef}>
              {!restaurants ? (
                <Skeleton height={36} width={36} />
              ) : (
                <Button
                  variant="light"
                  height="sm"
                  className="w-[40px]"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  <Sliders className="min-w-5" />
                </Button>
              )}

              <div
                className={classNames(
                  "flex items-center absolute top-[48px] right-0 w-[375px] bg-white transition-opacity duration-300 p-3 rounded border",
                  {
                    "shadow-lg opacity-100": filtersOpen,
                    "shadow-none opacity-0 pointer-events-none": !filtersOpen,
                  }
                )}
              >
                <div className="text-sm font-bold text-gray-500 mr-2">
                  Tri par
                </div>
                <ReactSelect
                  placeholder="Trier par..."
                  options={sortTypes}
                  className="mr-2 text-sm"
                  onChange={({ value }) => setSortType(value)}
                  defaultValue={sortTypes[0]}
                />
                <ReactSelect
                  placeholder="Ordre"
                  options={sortOrders}
                  className="text-sm"
                  onChange={({ value }) => setSortOrder(value)}
                  defaultValue={sortOrders[0]}
                />
              </div>
            </div>
          </div>

          {(restaurants || [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]).map(
            (r, i) => (
              <div className="block my-2 mx-3" key={i}>
                <RestaurantCard restaurant={r} />
                <div className="w-full border-b border-gray-100"></div>
              </div>
            )
          )}
          <div className="h-5"></div>
          {restaurants && (
            <div className="sticky bottom-0">
              <RestaurantIntrouvable />
            </div>
          )}
        </div>
      </div>
    </RestaurantCardHoverProvider>
  );
};

export default Restaurants;
