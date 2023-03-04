import Spinner from "components/Spinner";
import ProfileReviewCard from "components/ProfileReviewCard";
import { useGet } from "lib/useAxios";
import { useEffect, useState } from "react";
import { MapPin } from "react-feather";
import classNames from "classnames";
import Link from "next/link";
import RatingPill from "../RatingPill";

export function RecentActivity({ heightClass }) {
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
      className={classNames(
        "pl-2 pr-5 overflow-y-scroll max-w-xs scrollbar-hide mx-auto",
        heightClass
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
