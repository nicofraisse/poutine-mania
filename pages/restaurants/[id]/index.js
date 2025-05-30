import { useGet } from "lib/useAxios";
import { useRouter } from "next/router";
import { Spinner } from "components/Spinner";
import RestaurantReviews from "components/page-layouts/RestaurantReviews";
import RestaurantHeader from "components/RestaurantHeader";
import { Edit, Info, Trash } from "react-feather";
import { useEffect, useState } from "react";
import { ReviewOverview } from "components/ReviewOverview";
import { RestaurantInfo } from "components/RestaurantInfo";
import { ToggleSwitch } from "components/controls/ToggleSwitch";
import axios from "axios";
import { useCurrentUser } from "lib/useCurrentUser";
import Head from "next/head";
import { connectToDatabase } from "lib/db";
import toast from "react-hot-toast";
import { withI18n } from "../../../lib/withI18n";
import { i18n } from "../../../next-i18next.config";
import { useTranslation } from "next-i18next";

const Index = ({ SEO }) => {
  const { query, reload, push, isFallback, locale } = useRouter();
  const { data: restaurant, loading } = useGet(`/api/restaurants/${query.id}`, {
    skip: !query.id,
  });
  const { t } = useTranslation();

  if (isFallback) {
    return <Spinner />;
  }

  const [showMap, setShowMap] = useState(false);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    setShowMap(window?.innerWidth >= 640);

    window.addEventListener("resize", () => {
      if (window.innerWidth < 640) {
        setShowMap(false);
      } else {
        setShowMap(true);
      }
    });
  }, []);

  const handleApprove = async (id, approved) => {
    await axios
      .post(`/api/restaurants/${id}/approve`, { approved })
      .then(() => {
        reload(window.location.pathname);
      })
      .catch((e) => toast.error(e.message));
  };

  const handleDelete = async ({ _id, name }) => {
    if (window.confirm(`Êtes-vous sûr(e) de vouloir supprimer "${name}?"`)) {
      await axios
        .delete(`/api/restaurants/${_id}/delete`)
        .then(() => {
          toast.success("Supprimé!");
          push("/admin/restaurants");
        })
        .catch((e) => toast.error(e.message));
    }
  };

  const isSkeleton = !restaurant || loading;

  const localePrefix = locale === "en" ? "/en" : "";
  const seoUrl = `${process.env.NEXT_PUBLIC_APP_URL}${localePrefix}/restaurants/${SEO.slug}`;
  const seoImageUrl = SEO.mainPhoto
    ? `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/q_50/${SEO.mainPhoto}`
    : "";

  return (
    <>
      <Head>
        <script
          key="restaurant-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: SEO.restaurantName,
              image: seoImageUrl,
              address: {
                "@type": "PostalAddress",
                streetAddress: SEO.address,
              },
              url: seoUrl,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: SEO.averageRating,
                reviewCount: SEO.reviewCount,
                bestRating: "10",
                worstRating: "1",
              },
            }),
          }}
        />

        <title>
          {t("seo.restaurant.title", {
            name: SEO.restaurantName.toUpperCase(),
          })}
        </title>
        <meta
          name="description"
          content={t("seo.restaurant.description", {
            name: SEO.restaurantName,
          })}
        />
        <meta name="image" content={seoImageUrl} />

        <meta property="fb:app_id" content="572135587608476" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoUrl} />
        <meta
          property="og:title"
          content={t("seo.restaurant.ogTitle", {
            name: SEO.restaurantName.toUpperCase(),
          })}
        />
        <meta
          property="og:description"
          content={t("seo.restaurant.ogDescription", {
            name: SEO.restaurantName,
          })}
        />
        <meta property="og:image" content={seoImageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={seoUrl} />
        <meta
          property="twitter:title"
          content={t("seo.restaurant.twitterTitle", {
            name: SEO.restaurantName.toUpperCase(),
          })}
        />
        <meta
          property="twitter:description"
          content={t("seo.restaurant.twitterDescription", {
            name: SEO.restaurantName,
          })}
        />
        <meta property="twitter:image" content={seoImageUrl} />
      </Head>
      <div className="bg-[#fafafa] min-h-screen-minus-navbar">
        <RestaurantHeader restaurant={restaurant} />
        <div className="pb-4 pt-2 xs:p-4 xl:p-6 flex flex-col-reverse lg:flex-row">
          <div className="lg:basis-2/3 lg:max-w-2/3">
            {!isSkeleton && !restaurant.approved && (
              <div className="p-2 lg:p-5 sm:w-auto bg-yellow-50 xs:shadow-md rounded-lg text-sm flex mb-4">
                <Info className="inline-block min-w-8 mt-1 mr-2" size={20} />
                <p className="flex-shrink">{t("restaurant.pendingApproval")}</p>
              </div>
            )}
            {isSkeleton ? (
              <Spinner />
            ) : (
              <RestaurantReviews restaurant={restaurant} />
            )}
          </div>
          <div className="lg:w-1/3 lg:sticky lg:top-4 lg:h-full lg:ml-4 xl:ml-6 block sm:flex flex-row-reverse items-center lg:block">
            {!isSkeleton && currentUser?.isAdmin && (
              <div className="bg-white xs:shadow-md rounded-lg text-sm p-3 xl:p-5 mb-4 text-center text-gray-700 w-auto sm:w-1/2 lg:w-auto flex items-center justify-between">
                <div className="flex">
                  <ToggleSwitch
                    onChange={() =>
                      handleApprove(restaurant._id, !restaurant.approved)
                    }
                    checked={restaurant.approved}
                  />
                  <span className="ml-2">Approved</span>
                </div>
                <div>
                  <button
                    className="p-1 bg-gray-200 rounded xs:shadow hover:bg-gray-100 mx-2"
                    onClick={() =>
                      push(`/restaurants/${restaurant?.slug}/edit`)
                    }
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    className="p-1 bg-gray-200 rounded xs:shadow hover:bg-gray-100 mx-2"
                    onClick={() => handleDelete(restaurant)}
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            )}
            <div className="bg-white xs:shadow-md rounded-lg text-sm p-3 xl:p-5 mb-2 xs:mb-4 text-center text-gray-700 w-auto sm:w-1/2 lg:w-auto">
              <ReviewOverview restaurant={restaurant} />
            </div>

            <div className="bg-white xs:shadow-md rounded-lg text-xs xl:text-sm p-4 text-gray-700 w-auto sm:w-1/2 lg:w-auto sm:mr-4 lg:mr-0 mb-2 xs:mb-4 lg:mb-0">
              <RestaurantInfo
                showMap={showMap}
                setShowMap={setShowMap}
                restaurant={restaurant}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticPaths() {
  const client = await connectToDatabase();
  const db = client.db();
  const restaurants = await db
    .collection("restaurants")
    .find({ approved: true })
    .toArray();

  const paths = restaurants.flatMap((r) =>
    i18n.locales.map((loc) => ({
      params: { id: String(r.slug) },
      locale: loc,
    }))
  );

  return {
    paths,
    fallback: "blocking",
  };
}

export const getStaticProps = withI18n(async ({ params }) => {
  const client = await connectToDatabase();
  const db = await client.db();

  const restaurant = await db
    .collection("restaurants")
    .findOne({ slug: params.id });

  if (!restaurant) {
    return { notFound: true };
  }

  const validUserIds = await db.collection("users").distinct("_id");

  const reviews = await db
    .collection("reviews")
    .find({
      restaurantId: restaurant._id,
      userId: { $in: validUserIds },
    })
    .toArray();

  const reviewCount = reviews.length;

  const reviewsWithFinalRating = reviews.filter(
    (review) =>
      typeof review.finalRating === "number" &&
      review.finalRating >= 0 &&
      review.finalRating <= 10
  );

  const averageRating =
    reviewsWithFinalRating.reduce(
      (acc, review) => acc + review.finalRating,
      0
    ) / reviewsWithFinalRating.length || null;

  const address = restaurant.succursales?.[0]?.address?.place_name || "";

  return {
    props: {
      SEO: {
        restaurantName: restaurant.name,
        mainPhoto: restaurant.mainPhotos?.[0] || null,
        reviewCount,
        averageRating,
        address,
        slug: restaurant.slug,
      },
    },
    revalidate: 60,
  };
});

export default Index;
