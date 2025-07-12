import { Spinner } from "components/Spinner";
import { useGet } from "lib/useAxios";
import { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { ProfileReviewCard } from "../ProfileReviewCard";
import { useTranslation } from "next-i18next";

export function RecentActivity({ heightClass, isScrollable }) {
  const [limit] = useState(5);
  const [page, setPage] = useState(1);
  const [allReviews, setAllReviews] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { t } = useTranslation();
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  const { data: reviews, loading } = useGet(
    `/api/reviews?limit=${limit}&page=${page}&sort=date:desc`
  );

  // Handle new reviews data
  if (reviews && !allReviews.includes(reviews[0])) {
    setAllReviews((prevAllReviews) => [...prevAllReviews, ...reviews]);
    setIsLoadingMore(false);
  }

  const handleLoadMore = () => {
    if (!isLoadingMore) {
      setIsLoadingMore(true);
      setPage((p) => p + 1);
    }
  };

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !loading &&
          !isLoadingMore &&
          reviews?.length === limit
        ) {
          handleLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, isLoadingMore, reviews?.length, limit]);

  // Update observer when loadingRef changes
  useEffect(() => {
    if (observerRef.current && loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }
  }, [loadingRef.current]);

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
      {/* Infinite scroll trigger and loading indicator */}
      <div ref={loadingRef} className="flex justify-center items-center py-4">
        {(loading && page === 1) || isLoadingMore ? (
          <Spinner />
        ) : reviews?.length === limit ? (
          <div className="text-gray-500 text-sm">
            {/* This div triggers the intersection observer for infinite scroll */}
          </div>
        ) : (
          <div className="text-gray-400 text-sm text-center">
            {allReviews.length > 0 && t("home.recentActivity.noMoreReviews")}
          </div>
        )}
      </div>
    </div>
  );
}
