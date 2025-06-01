import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useGet } from "../../../lib/useAxios";
import { useTranslation } from "next-i18next";
import { withI18n } from "../../../lib/withI18n";
import ProfileLayout from "../../../components/profile/ProfileLayout";
import MapMap from "../../../components/Map";
import { RestaurantCardHoverProvider } from "../../../components/context/RestaurantCardHoverProvider";

const UserMap = ({ user, restaurants, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-sm mt-4">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold mb-2">
            Aucune poutinerie visitée
          </h3>
          <p className="text-sm">
            {user?.name || "Cet utilisateur"} n'a pas encore ajouté de
            poutineries à sa liste
          </p>
        </div>
      </div>
    );
  }

  // Filter out restaurants without addresses
  const restaurantsWithLocations = restaurants.filter(
    (r) =>
      r.succursales &&
      r.succursales.length > 0 &&
      r.succursales.some((s) => s.address?.center)
  );

  // Count unique restaurants visited and watched
  const visitedCount = restaurants.filter((r) => r.isInEatenList).length;
  const watchlistCount = restaurants.filter((r) => r.isInWatchlist).length;
  const reviewedCount = restaurants.filter((r) => r.review).length;
  const locationsCount = restaurantsWithLocations.length;

  if (restaurantsWithLocations.length === 0) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📍</div>
          <h3 className="text-lg font-semibold mb-2">
            Aucune localisation disponible
          </h3>
          <p className="text-sm">
            Les poutineries dans la liste n'ont pas d'adresse enregistrée
          </p>
          <p className="text-xs mt-2 text-gray-400">
            {restaurants.length} poutinerie{restaurants.length > 1 ? "s" : ""}{" "}
            sans localisation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {visitedCount}
              </span>{" "}
              poutinerie{visitedCount !== 1 ? "s" : ""} visitée
              {visitedCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {watchlistCount}
              </span>{" "}
              à essayer
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {reviewedCount}
              </span>{" "}
              évaluation{reviewedCount !== 1 ? "s" : ""}
            </span>
          </div>
          {restaurants.length > locationsCount && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {restaurants.length - locationsCount}
                </span>{" "}
                sans localisation
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Map container */}
      <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
        <RestaurantCardHoverProvider>
          <MapMap
            restaurants={restaurantsWithLocations}
            isShowPage={false}
            showCitiesNav={false}
            enableSearch={false}
          />
        </RestaurantCardHoverProvider>
      </div>
    </div>
  );
};

const UserProfileMap = () => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const { data: user } = useGet(`/api/users/${query.id}`, { skip: !query.id });
  const { data: restaurants, loading: restaurantsLoading } = useGet(
    `/api/users/${query.id}/map`,
    { skip: !query.id }
  );

  return (
    <>
      <Head>
        <title>
          {user?.name
            ? `${user.name} - Carte des Poutineries`
            : "Carte Utilisateur"}
        </title>
        <meta
          name="description"
          content={`Explorez la carte des poutineries visitées par ${
            user?.name || "cet utilisateur"
          }`}
        />
        <meta
          property="og:title"
          content={`${user?.name || "Utilisateur"} - Carte des Poutineries`}
        />
        <meta
          property="og:description"
          content={`Explorez la carte des poutineries visitées par ${
            user?.name || "cet utilisateur"
          }`}
        />
        <meta property="og:type" content="profile" />
      </Head>

      <UserMap
        user={user}
        restaurants={restaurants}
        loading={restaurantsLoading}
      />
    </>
  );
};

UserProfileMap.getLayout = function getLayout(page) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export const getStaticProps = withI18n();

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default UserProfileMap;
