import Spinner from "../components/Spinner";
import ProfileReviewCard from "../components/ProfileReviewCard";
import { useGet } from "../lib/useAxios";
import { useEffect, useState } from "react";
import { MapPin } from "react-feather";
import classNames from "classnames";
import RatingPill from "../components/RatingPill";
import Link from "next/link";

function HomePage() {
  const [paginationSkip, setPaginationSkip] = useState(0);
  const [allReviews, setAllReviews] = useState([]);

  const { data: reviews, loading } = useGet(
    `/api/reviews?skip=${paginationSkip}`
  );

  const { data: restaurants, loading: restaurantsLoading } = useGet(
    `/api/restaurants?sort=avgRating&order=-1&limit=3&minReviewCount=1`
  );

  useEffect(() => {
    if (reviews) {
      setAllReviews((prevAllReviews) => [...prevAllReviews, ...reviews]);
    }
  }, [reviews]);

  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    if (offsetHeight + scrollTop >= scrollHeight - 10) {
      setPaginationSkip(allReviews.length);
    }
  };

  if (!reviews) return <Spinner />;

  return (
    <div
      className="h-screen-minus-navbar overflow-y-scroll px-5 md:pr-2 py-5 md:pt-0"
      onScroll={handleScroll}
    >
      <div className="md:flex md:flex-row-reverse md:justify-evenly">
        <div className="md:p-4">
          <div className="md:sticky md:top-[28px] md:pl-2 xl:pl-5 md:min-w-[400px]">
            <h2 className="text-2xl font-bold">Les poutines coup de coeur</h2>
            <div className="text-gray-500 mb-4">Notées par la communauté</div>
            {restaurants?.map((r, i) => (
              <div
                key={r._id}
                className={classNames(
                  "p-3 pr-6 2xl:p-4 2xl:pr-7 my-3 rounded-lg border-2 shadow-md bg-opacity-50",
                  {
                    "border-yellow-200 bg-yellow-50": i === 0,
                    "border-slate-300 bg-slate-100": i === 1,
                    "border-slate-300 bg-slate-100": i === 1,
                    "border-orange-200 bg-orange-50": i === 2,
                  }
                )}
              >
                <div className="flex items-center">
                  <span className="text-5xl mr-3 w-14 flex justify-center">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </span>
                  <div>
                    <Link href={`/restaurants/${r._id}`} passHref>
                      <a className="text-xl font-black text-teal-500 mb-1 hover:text-teal-600">
                        {r.name}
                      </a>
                    </Link>
                    <div className="text-xs text-gray-400">
                      <MapPin size={15} className="inline mt-[-2px]" />{" "}
                      {r.succursales.length === 1
                        ? r.succursales[0].address.place_name.split(", Q")[0]
                        : `${r.succursales.length} adresses au Québec`}
                    </div>
                    <div className="mt-3 w-28">
                      <RatingPill
                        avgRating={r.avgRating}
                        reviewCount={r.reviewCount}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-[600px]">
          <h2 className="text-2xl font-bold my-4 mt-10 md:mt-7">
            Derniers avis
          </h2>
          {allReviews.map((review) => (
            <ProfileReviewCard review={review} key={review._id} isIndex />
          ))}
          <div className="h-[72px]">
            {loading && (
              <div className="flex justify-center">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
