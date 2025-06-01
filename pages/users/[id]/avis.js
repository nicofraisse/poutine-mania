import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useGet } from "../../../lib/useAxios";
import { withI18n } from "../../../lib/withI18n";
import UserLastReviews from "../../../components/profile/UserLastReviews";
import ProfileLayout from "../../../components/profile/ProfileLayout";

const UserProfileReviews = () => {
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
          {user?.name ? `${user.name} - Avis et Critiques` : "Avis Utilisateur"}
        </title>
        <meta
          name="description"
          content={`Consultez tous les avis et critiques de poutines de ${
            user?.name || "cet utilisateur"
          }`}
        />
        <meta
          property="og:title"
          content={`${user?.name || "Utilisateur"} - Avis et Critiques`}
        />
        <meta
          property="og:description"
          content={`Consultez tous les avis et critiques de poutines de ${
            user?.name || "cet utilisateur"
          }`}
        />
        <meta property="og:type" content="profile" />
      </Head>

      <UserLastReviews reviews={reviews} user={user} loading={reviewsLoading} />
    </>
  );
};

UserProfileReviews.getLayout = function getLayout(page) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export const getStaticProps = withI18n();

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default UserProfileReviews;
