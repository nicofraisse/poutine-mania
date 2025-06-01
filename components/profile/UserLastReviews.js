import React from "react";
import ProfileReviewCard from "../ProfileReviewCard";

const UserLastReviews = ({ reviews, user, loading }) => {
  return (
    <div>
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

export default UserLastReviews;
