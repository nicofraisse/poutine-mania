import Spinner from "components/Spinner";
import { useGet } from "lib/useAxios";
import { useEffect, useState } from "react";
import classNames from "classnames";
import ProfileReviewCard from "../ProfileReviewCard";

export function RecentActivity({ heightClass, isScrollable }) {
  const [paginationSkip, setPaginationSkip] = useState(0);
  const [allReviews, setAllReviews] = useState([]);

  const { data: reviews, loading } = useGet(
    `/api/reviews?skip=${paginationSkip}`
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

  return (
    <div
      className={classNames(
        "px-4 sm:pl-2 max-w-xs scrollbar-hide mx-auto pt-1",
        heightClass,
        {
          "overflow-y-scroll": isScrollable,
        }
      )}
      onScroll={handleScroll}
    >
      {(loading && paginationSkip === 0 ? [{}, {}, {}, {}] : allReviews).map(
        (review, i) => (
          <ProfileReviewCard
            loading={loading && paginationSkip === 0}
            review={review}
            key={i}
            isIndex
          />
        )
      )}
      <div className="h-[70px]">
        {loading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
