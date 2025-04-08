import { Spinner } from "components/Spinner";
import { useGet } from "lib/useAxios";
import { useState } from "react";
import classNames from "classnames";
import ProfileReviewCard from "../ProfileReviewCard";

export function RecentActivity({ heightClass, isScrollable }) {
  const [limit] = useState(5);
  const [page, setPage] = useState(1);
  const [allReviews, setAllReviews] = useState([]);

  const { data: reviews, loading } = useGet(
    `/api/reviews?limit=${limit}&page=${page}&sort=date:desc`
  );

  if (reviews && !allReviews.includes(reviews[0])) {
    setAllReviews((prevAllReviews) => [...prevAllReviews, ...reviews]);
  }

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <div
      className={classNames(
        "px-4 sm:pl-2 max-w-xs scrollbar-hide mx-auto pt-1",
        heightClass,
        {
          "overflow-y-scroll": isScrollable,
        }
      )}
    >
      {(loading && page === 1 ? [{}, {}, {}, {}, {}] : allReviews).map(
        (review, i) => (
          <ProfileReviewCard
            loading={loading && page === 1}
            review={review}
            key={i}
            isIndex
          />
        )
      )}
      <div className="flex justify-center items-center">
        {loading ? (
          <Spinner />
        ) : (
          reviews?.length === limit && (
            <button
              onClick={handleLoadMore}
              className="border-none outline-none underline text-gray-600"
              // variant="secondary"
            >
              Voir plus
            </button>
          )
        )}
      </div>
    </div>
  );
}
