import React from "react";
import { ProfileReviewCard } from "../ProfileReviewCard";

export const UserLastReviews = ({ reviews, user, loading }) => {
  return (
    <div className="p-3 xs:p-4 sm:p-0">
      {(reviews || [{}, {}, {}, {}]).map((review, i) => (
        <ProfileReviewCard
          review={review}
          key={i}
          userName={user?.name}
          loading={loading || !reviews}
        />
      ))}
    </div>
  );
};
