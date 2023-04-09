import Spinner from "components/Spinner";
import ProfileReviewCard from "components/ProfileReviewCard";
import { useGet } from "lib/useAxios";
import { useEffect, useState } from "react";
import classNames from "classnames";

export function RecentActivity({ heightClass, isScrollable }) {
  const [paginationSkip, setPaginationSkip] = useState(0);
  const [allReviews, setAllReviews] = useState([]);

  const { data: reviews, loading } = useGet(
    `/api/reviews?skip=${paginationSkip}`
  );

  console.log(reviews);

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
      className={classNames(
        "pl-4 sm:pl-2 pr-5 max-w-xs scrollbar-hide mx-auto",
        heightClass,
        {
          "overflow-y-scroll": isScrollable,
        }
      )}
      onScroll={handleScroll}
    >
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
  );
}
