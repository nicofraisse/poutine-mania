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

const Noter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedValue] = useDebounce(searchQuery, 250);
  const { query } = useRouter();

  const { data: searchResults, loading: searchResultsLoading } = useGet(
    `/api/restaurants?search=${debouncedValue}&limit=10`
  );
  const { currentUser } = useCurrentUser();
  const { data: userReviews } = useGet(
    `/api/users/${currentUser?._id}/reviews`,
    {
      skip: !currentUser,
    }
  );

  return (
    <>
      <Head>
        <title>Noter une poutine | Poutine Mania</title>
        <meta
          name="description"
          content="Évaluez la poutine de votre choix en un instant : frites, fromage, sauce, et rapport portion/prix. Partagez votre avis et aidez les autres à trouver le meilleur restaurant à poutine!"
        />
      </Head>
      <div className="max-w-md mx-auto bg-white sm:p-3">
        <div className="p-4">
          {query.fromRateSuccess && (
            <div
              className="
                flex
                flex-col items-center justify-center
                mb-5 p-3 text-center border-2 rounded-lg bg-white shadow-md
              "
            >
              <div className="flex items-center mb-2">
                <CheckCircle className="text-green-400 mr-3 -mb-1" size={36} />
                <div className="font-bold text-xl">Avis publié!</div>
              </div>
              <div className="text-gray-400 px-3 text-sm">
                Merci d&apos;avoir noté cette poutine. Ton avis compte! Chaque
                note que tu donne aide la communauté à trouver les meilleures
                poutine locales.
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded text-gray-700 text-sm mt-2 cursor-pointer">
                <Link
                  legacyBehavior
                  href={`/restaurants/${query.fromRateSuccess}`}
                >
                  Voir ton avis
                </Link>
              </div>
            </div>
          )}
          <h1 className="text-xl font-black mb-2">
            Noter une {query.fromRateSuccess && "autre"} poutine
          </h1>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Quelle poutine voulez-vous noter?"
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
              Aucun résultat pour &quot;{searchQuery}&quot;
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

export default Noter;
