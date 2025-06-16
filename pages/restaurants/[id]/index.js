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
        {/* Restaurant Schema */}
        <script
          key="restaurant-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: SEO.restaurantName,
              image:
                SEO.allPhotos?.map(
                  (photo) =>
                    `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/q_80/${photo}`
                ) || [],
              address: {
                "@type": "PostalAddress",
                streetAddress: SEO.address,
                addressLocality: SEO.city,
                addressRegion: SEO.province || "QC",
                addressCountry: "CA",
              },
              url: seoUrl,
              telephone: SEO.phone,
              priceRange: SEO.priceRange || "$$",
              servesCuisine: ["Canadian", "Quebec", "Poutine"],
              aggregateRating: SEO.averageRating
                ? {
                    "@type": "AggregateRating",
                    ratingValue: Number(SEO.averageRating).toFixed(1),
                    reviewCount: SEO.reviewCount,
                    bestRating: "10",
                    worstRating: "1",
                  }
                : undefined,
              review:
                SEO.topReviews?.map((review) => ({
                  "@type": "Review",
                  author: {
                    "@type": "Person",
                    name: review.authorName,
                  },
                  datePublished: review.createdAt,
                  reviewBody: review.comment,
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: review.rating,
                    bestRating: "10",
                    worstRating: "1",
                  },
                })) || [],
              hasMenu: {
                "@type": "Menu",
                hasMenuSection: {
                  "@type": "MenuSection",
                  name: "Poutines",
                  hasMenuItem: {
                    "@type": "MenuItem",
                    name: "Poutine",
                    description: `Famous poutine at ${SEO.restaurantName}`,
                    offers: {
                      "@type": "Offer",
                      priceCurrency: "CAD",
                    },
                  },
                },
              },
            }),
          }}
        />

        {/* LocalBusiness Schema for better local SEO */}
        <script
          key="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": seoUrl,
              name: SEO.restaurantName,
              image:
                SEO.allPhotos?.map(
                  (photo) =>
                    `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/q_80/${photo}`
                ) || [],
              url: seoUrl,
              address: {
                "@type": "PostalAddress",
                streetAddress: SEO.address,
                addressLocality: SEO.city,
                addressRegion: SEO.province || "QC",
                addressCountry: "CA",
              },
              geo: SEO.coordinates
                ? {
                    "@type": "GeoCoordinates",
                    latitude: SEO.coordinates.lat,
                    longitude: SEO.coordinates.lng,
                  }
                : undefined,
              aggregateRating: SEO.averageRating
                ? {
                    "@type": "AggregateRating",
                    ratingValue: Number(SEO.averageRating).toFixed(1),
                    reviewCount: SEO.reviewCount,
                    bestRating: "10",
                    worstRating: "1",
                  }
                : undefined,
            }),
          }}
        />

        {/* FAQ Schema for common poutine questions */}
        <script
          key="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: t("faq.bestPoutine.question", {
                    restaurant: SEO.restaurantName,
                  }),
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: t("faq.bestPoutine.answer", {
                      restaurant: SEO.restaurantName,
                      rating: SEO.averageRating
                        ? Number(SEO.averageRating).toFixed(1)
                        : "N/A",
                      reviews: SEO.reviewCount,
                    }),
                  },
                },
                {
                  "@type": "Question",
                  name: t("faq.poutinePrice.question", {
                    restaurant: SEO.restaurantName,
                  }),
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: t("faq.poutinePrice.answer", {
                      restaurant: SEO.restaurantName,
                    }),
                  },
                },
                {
                  "@type": "Question",
                  name: t("faq.poutineReviews.question", {
                    restaurant: SEO.restaurantName,
                  }),
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: t("faq.poutineReviews.answer", {
                      restaurant: SEO.restaurantName,
                      reviews: SEO.reviewCount,
                      rating: SEO.averageRating
                        ? Number(SEO.averageRating).toFixed(1)
                        : "N/A",
                    }),
                  },
                },
              ],
            }),
          }}
        />

        <title>
          {t(
            SEO.averageRating
              ? "seo.restaurant.titleWithRating"
              : "seo.restaurant.title",
            {
              name: SEO.restaurantName,
              rating: SEO.averageRating
                ? Number(SEO.averageRating).toFixed(1)
                : null,
              reviews: SEO.reviewCount,
            }
          )}
        </title>
        <meta
          name="description"
          content={t(
            SEO.averageRating
              ? "seo.restaurant.descriptionWithRating"
              : "seo.restaurant.description",
            {
              name: SEO.restaurantName,
              rating: SEO.averageRating
                ? Number(SEO.averageRating).toFixed(1)
                : null,
              reviews: SEO.reviewCount,
              address: SEO.city || SEO.address?.split(",")[1]?.trim(),
              topRatingText: SEO.topRatingText || "",
            }
          )}
        />
        <meta name="image" content={seoImageUrl} />
        <meta
          name="keywords"
          content={`${SEO.restaurantName}, poutine, ${
            SEO.city
          }, restaurant, reviews, rating, fries, cheese, gravy, Quebec, Canada${
            SEO.averageRating
              ? `, ${Number(SEO.averageRating).toFixed(1)} stars`
              : ""
          }`}
        />
        <meta name="author" content="Poutine Mania" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <link rel="canonical" href={seoUrl} />

        <meta property="fb:app_id" content="572135587608476" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoUrl} />
        <meta
          property="og:title"
          content={t(
            SEO.averageRating
              ? "seo.restaurant.ogTitleWithRating"
              : "seo.restaurant.ogTitle",
            {
              name: SEO.restaurantName,
              rating: SEO.averageRating
                ? Number(SEO.averageRating).toFixed(1)
                : null,
              reviews: SEO.reviewCount,
            }
          )}
        />
        <meta
          property="og:description"
          content={t(
            SEO.averageRating
              ? "seo.restaurant.ogDescriptionWithRating"
              : "seo.restaurant.ogDescription",
            {
              name: SEO.restaurantName,
              rating: SEO.averageRating
                ? Number(SEO.averageRating).toFixed(1)
                : null,
              reviews: SEO.reviewCount,
              address: SEO.city || SEO.address?.split(",")[1]?.trim(),
            }
          )}
        />
        <meta property="og:image" content={seoImageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={seoUrl} />
        <meta
          property="twitter:title"
          content={t(
            SEO.averageRating
              ? "seo.restaurant.twitterTitleWithRating"
              : "seo.restaurant.twitterTitle",
            {
              name: SEO.restaurantName,
              rating: SEO.averageRating
                ? Number(SEO.averageRating).toFixed(1)
                : null,
              reviews: SEO.reviewCount,
            }
          )}
        />
        <meta
          property="twitter:description"
          content={t(
            SEO.averageRating
              ? "seo.restaurant.twitterDescriptionWithRating"
              : "seo.restaurant.twitterDescription",
            {
              name: SEO.restaurantName,
              rating: SEO.averageRating
                ? Number(SEO.averageRating).toFixed(1)
                : null,
              reviews: SEO.reviewCount,
              address: SEO.city || SEO.address?.split(",")[1]?.trim(),
            }
          )}
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
  const coordinates = restaurant.succursales?.[0]?.address?.coordinates || null;
  const city =
    restaurant.succursales?.[0]?.address?.context?.find((c) =>
      c.id?.includes("place")
    )?.text || "";
  const province =
    restaurant.succursales?.[0]?.address?.context?.find((c) =>
      c.id?.includes("region")
    )?.text || "";
  const phone = restaurant.succursales?.[0]?.phoneNumber || "";

  // Get top 3 reviews for structured data
  const topReviews = await db
    .collection("reviews")
    .aggregate([
      {
        $match: {
          restaurantId: restaurant._id,
          userId: { $in: validUserIds },
          comment: { $exists: true, $ne: "" },
          finalRating: { $gte: 7 }, // Only good reviews for SEO
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          comment: 1,
          finalRating: 1,
          createdAt: 1,
          authorName: { $ifNull: ["$user.name", "Anonymous"] },
        },
      },
      { $sort: { finalRating: -1, createdAt: -1 } },
      { $limit: 3 },
    ])
    .toArray();

  // Generate compelling rating text for SEO
  let topRatingText = "";
  if (averageRating >= 8.5) {
    topRatingText = "Excellent poutine";
  } else if (averageRating >= 7.5) {
    topRatingText = "Great poutine";
  } else if (averageRating >= 6.5) {
    topRatingText = "Good poutine";
  }

  return {
    props: {
      SEO: {
        restaurantName: restaurant.name,
        mainPhoto: restaurant.mainPhotos?.[0] || null,
        allPhotos: restaurant.mainPhotos || [],
        reviewCount,
        averageRating,
        address,
        city,
        province,
        phone,
        coordinates: coordinates
          ? {
              lat: coordinates[1],
              lng: coordinates[0],
            }
          : null,
        slug: restaurant.slug,
        topReviews: topReviews.map((review) => ({
          comment: review.comment,
          rating: review.finalRating,
          createdAt: review.createdAt.toISOString(),
          authorName: review.authorName,
        })),
        topRatingText,
        priceRange: restaurant.priceRange || "$$",
      },
    },
    revalidate: 60,
  };
});

export default Index;
