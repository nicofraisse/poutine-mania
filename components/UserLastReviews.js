import React from "react";
import { formatName } from "../lib/formatName";
import ProfileReviewCard from "./ProfileReviewCard";

const UserLastReviews = ({ reviews, user }) => {
  console.log(user.name);
  return (
    <div>
      {reviews.map((review) => (
        <ProfileReviewCard
          review={review}
          key={review._id}
          userName={formatName(user)}
        />
      ))}
    </div>
  );
};

export default UserLastReviews;
