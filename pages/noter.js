import Link from "next/link";
import { useState } from "react";
import SelectRestaurant from "components/forms/SelectRestaurant";
import Input from "components/Input";
import { useCurrentUser } from "lib/useCurrentUser";
import { useGet } from "../lib/useAxios";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { CheckCircle } from "react-feather";
import RestaurantIntrouvable from "../components/RestaurantIntrouvable";
import Head from "next/head";
import { withI18n } from "../lib/withI18n";
import { useTranslation } from "next-i18next";
import { getUrlQueryString } from "lib/getUrlqueryString";

const Noter = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedValue] = useDebounce(searchQuery, 250);
  const { query } = useRouter();

  const { data: searchResults, loading: searchResultsLoading } = useGet(
    `/api/restaurants${getUrlQueryString({
      search: debouncedValue,
      limit: 10,
      sort: "reviewCount",
      order: -1,
    })}`
  );
  const { currentUser } = useCurrentUser();
  const { data: userReviews } = useGet(
    `/api/users/${currentUser?._id}/reviews`,
    { skip: !currentUser }
  );

  return (
    <>
      <Head>
        <title>{t("rateRestaurant.pageTitle")}</title>
        <meta
          name="description"
          content={t("rateRestaurant.metaDescription")}
        />
      </Head>
      <div className="max-w-md mx-auto bg-white sm:p-3">
        <div className="p-4">
          {query.fromRateSuccess && (
            <div className="flex flex-col items-center justify-center mb-5 p-3 text-center border-2 rounded-lg bg-white shadow-md">
              <div className="flex items-center mb-2">
                <CheckCircle className="text-green-400 mr-3 -mb-1" size={36} />
                <div className="font-bold text-xl">
                  {t("rateRestaurant.submitSuccessTitle")}
                </div>
              </div>
              <div className="text-gray-400 px-3 text-sm">
                {t("rateRestaurant.submitSuccessMessage")}
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded text-gray-700 text-sm mt-2 cursor-pointer">
                <Link
                  legacyBehavior
                  href={`/restaurants/${query.fromRateSuccess}`}
                >
                  {t("rateRestaurant.viewYourReview")}
                </Link>
              </div>
            </div>
          )}
          <h1 className="text-xl font-black mb-2">
            {query.fromRateSuccess
              ? t("rateRestaurant.titleOther")
              : t("rateRestaurant.title")}
          </h1>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder={t("rateRestaurant.inputPlaceholder")}
            loading={searchResultsLoading}
          />
        </div>

        {searchResults?.length > 0 ? (
          <SelectRestaurant
            restaurants={searchResults}
            userRatedRestaurants={userReviews}
          />
        ) : (
          !searchResultsLoading &&
          debouncedValue === searchQuery && (
            <div className="text-sm p-5 text-gray-400">
              {t("rateRestaurant.noResults", { query: searchQuery })}
            </div>
          )
        )}
        <div className="m-3">
          <RestaurantIntrouvable />
        </div>
      </div>
    </>
  );
};

export const getStaticProps = withI18n();

export default Noter;
