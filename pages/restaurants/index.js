import { useMemo, useState } from "react";

import Map from "components/Map";
import RestaurantCard from "components/RestaurantCard";
import { useRestaurantSearch } from "components/context/RestaurantSearchProvider";
import { useGet } from "lib/useAxios";
import { RestaurantCardHoverProvider } from "components/context/RestaurantCardHoverProvider";
import { X } from "react-feather";
import useClickOutside from "lib/useClickOutside";
import classNames from "classnames";
import { getUrlQueryString } from "lib/getUrlqueryString";
import { useRouter } from "next/router";
import RestaurantIntrouvable from "components/RestaurantIntrouvable";
import { flatten } from "lodash";
import Skeleton from "react-loading-skeleton";
import { RestaurantsFilters } from "../../components/RestaurantsFilters";
import Head from "next/head";

const sortTypes = [
  { label: "Popularité", value: "reviewCount" },
  { label: "Nom", value: "name" },
  { label: "Note moyenne", value: "avgRating" },
];

const sortOrders = [
  { label: "Décroissant", value: -1 },
  { label: "Croissant", value: 1 },
];

const Restaurants = () => {
  const { searchValue } = useRestaurantSearch();
  const [sortType, setSortType] = useState("reviewCount");
  const [sortOrder, setSortOrder] = useState(-1);
  const [priceFilter, setPriceFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useClickOutside(() => setFiltersOpen(false));
  const { push } = useRouter();

  const onApplyFilters = (priceFilter, categoryFilter, ratingFilter) => {
    setPriceFilter(priceFilter);
    setCategoryFilter(categoryFilter);
    setRatingFilter(ratingFilter);
  };

  const url = useMemo(() => {
    return `/api/restaurants${getUrlQueryString({
      search: searchValue && encodeURIComponent(searchValue.trim()),
      sort: sortType,
      order: sortOrder,
      noUnapproved: true,
      rating: ratingFilter,
      categories: categoryFilter?.length ? categoryFilter : undefined,
      price: priceFilter?.length ? priceFilter : undefined,
    })}`;
  }, [
    searchValue,
    sortType,
    sortOrder,
    ratingFilter,
    categoryFilter,
    priceFilter,
  ]);

  const { data: restaurants } = useGet(url);

  const allSuccursales =
    restaurants && flatten(restaurants.map((r) => r.succursales));

  return (
    <>
      <Head>
        <title>Restaurants | Poutine Mania</title>
        <meta
          name="description"
          content="Parcourez la carte interactive de poutineries au Québec. Filtrez par note, prix ou catégorie pour dénicher la poutine parfaite près de chez vous."
        />
      </Head>
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
            <div className="px-3 mb-3 lg:mb-0 flex justify-between items-start w-full">
              {!restaurants ? (
                <Skeleton
                  width="300px"
                  height="24px"
                  className="relative top-2"
                />
              ) : (
                <h2
                  className="font-bold text-slate-500 md:text-lg flex items-center h-12 mr-2"
                  style={{ lineHeight: 1.3 }}
                >
                  {restaurants.length > 0 ? (
                    <>
                      {restaurants.length} poutinerie
                      {restaurants.length > 1 && "s"} • {allSuccursales.length}{" "}
                      adresse
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

              <RestaurantsFilters
                filtersRef={filtersRef}
                restaurants={restaurants}
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                setSortType={setSortType}
                setSortOrder={setSortOrder}
                sortOrders={sortOrders}
                sortTypes={sortTypes}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                ratingFilter={ratingFilter}
                setRatingFilter={setRatingFilter}
                onApplyFilters={onApplyFilters}
              />
            </div>

            {(restaurants || [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]).map(
              (r, i) => (
                <div className="block my-2 xs:mx-3" key={i}>
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
    </>
  );
};

export default Restaurants;
