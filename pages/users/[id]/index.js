import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import UserRanking from "../../../components/UserRanking";
import { useGet } from "../../../lib/useAxios";
import { EmptyState } from "../../../components/EmptyState";
import { useTranslation } from "next-i18next";
import { withI18n } from "../../../lib/withI18n";
import { ProfileLayout } from "../../../components/profile/ProfileLayout";

const UserProfileRankings = () => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const { data: user } = useGet(`/api/users/${query.id}`, { skip: !query.id });
  const { data: reviews, loading: reviewsLoading } = useGet(
    `/api/users/${query.id}/reviews`,
    { skip: !query.id }
  );

  return (
    <>
      <Head>
        <title>
          {user?.name ? `${user.name} - Top Poutines` : "Profil Utilisateur"}
        </title>
        <meta
          name="description"
          content={`Découvrez le classement des meilleures poutines selon ${
            user?.name || "cet utilisateur"
          }`}
        />
        <meta
          property="og:title"
          content={`${user?.name || "Utilisateur"} - Top Poutines`}
        />
        <meta
          property="og:description"
          content={`Découvrez le classement des meilleures poutines selon ${
            user?.name || "cet utilisateur"
          }`}
        />
        <meta property="og:type" content="profile" />
      </Head>

      {!reviewsLoading && reviews?.length === 0 ? (
        <EmptyState hideButton title={t("userProfile.emptyState.title")} />
      ) : (
        <UserRanking reviews={reviews} loading={reviewsLoading} />
      )}
    </>
  );
};

UserProfileRankings.getLayout = function getLayout(page) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export const getStaticProps = withI18n();

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default UserProfileRankings;
