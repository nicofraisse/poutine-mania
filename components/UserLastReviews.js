import React from "react";
import ProfileReviewCard from "./ProfileReviewCard";

const UserLastReviews = ({ reviews, user }) => {
  return (
    <div>
      {(reviews || [{}, {}, {}, {}]).map((review) => (
        <ProfileReviewCard
          review={review}
          key={review?._id}
          userName={user?.name}
          loading={!reviews}
        />
      ))}
    </div>
  );
};

export default UserLastReviews;
