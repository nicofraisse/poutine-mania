import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Head from "next/head";
import classNames from "classnames";
import { X } from "react-feather";
import Map from "components/Map";
import RestaurantCard from "components/RestaurantCard";
import RestaurantIntrouvable from "components/RestaurantIntrouvable";
import { RestaurantsFilters } from "components/RestaurantsFilters";
import { useRestaurantSearch } from "components/context/RestaurantSearchProvider";
import { useGet } from "lib/useAxios";
import { getUrlQueryString } from "lib/getUrlqueryString";
import useClickOutside from "lib/useClickOutside";
import { RestaurantCardHoverProvider } from "components/context/RestaurantCardHoverProvider";
import { flatten } from "lodash";
import Skeleton from "react-loading-skeleton";
import { withI18n } from "../../lib/withI18n";

const Restaurants = () => {
  const { t } = useTranslation();
  const { searchValue } = useRestaurantSearch();
  const [sortType, setSortType] = useState("reviewCount");
  const [sortOrder, setSortOrder] = useState(-1);
  const [priceFilter, setPriceFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useClickOutside(() => setFiltersOpen(false));
  const { push } = useRouter();

  const sortTypes = [
    { label: t("restaurants.sortTypes.popularity"), value: "reviewCount" },
    { label: t("restaurants.sortTypes.name"), value: "name" },
    { label: t("restaurants.sortTypes.avgRating"), value: "avgRating" },
  ];
  const sortOrders = [
    { label: t("restaurants.sortOrders.desc"), value: -1 },
    { label: t("restaurants.sortOrders.asc"), value: 1 },
  ];

  const onApplyFilters = (pf, cf, rf) => {
    setPriceFilter(pf);
    setCategoryFilter(cf);
    setRatingFilter(rf);
  };

  const url = useMemo(
    () =>
      `/api/restaurants${getUrlQueryString({
        search: searchValue && encodeURIComponent(searchValue.trim()),
        sort: sortType,
        order: sortOrder,
        noUnapproved: true,
        rating: ratingFilter,
        categories: categoryFilter?.length ? categoryFilter : undefined,
        price: priceFilter?.length ? priceFilter : undefined,
      })}`,
    [
      searchValue,
      sortType,
      sortOrder,
      ratingFilter,
      categoryFilter,
      priceFilter,
    ]
  );

  const { data: restaurants } = useGet(url);
  const allSuccursales =
    restaurants && flatten(restaurants.map((r) => r.succursales));

  return (
    <>
      <Head>
        <title>{t("restaurants.pageTitle")}</title>
        <meta name="description" content={t("restaurants.metaDescription")} />
      </Head>
      <h1 className="hidden">{t("restaurants.h1")}</h1>
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
                      {restaurants.length > 1
                        ? t("restaurants.resultsCount_plural", {
                            count: restaurants.length,
                          })
                        : t("restaurants.resultsCount", {
                            count: restaurants.length,
                          })}{" "}
                      •{" "}
                      {allSuccursales.length > 1
                        ? t("restaurants.succursalesCount_plural", {
                            count: allSuccursales.length,
                          })
                        : t("restaurants.succursalesCount", {
                            count: allSuccursales.length,
                          })}
                    </>
                  ) : (
                    t("restaurants.noResults")
                  )}
                  {searchValue && (
                    <>
                      {" "}
                      {t("restaurants.forSearch", {
                        search: searchValue,
                      })}
                    </>
                  )}
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
                  <div className="w-full border-b border-gray-100" />
                </div>
              )
            )}
            <div className="h-5" />
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

export const getStaticProps = withI18n();
export default Restaurants;
