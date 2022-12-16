import { useRouter } from "next/router";
import React, { useState } from "react";
import { useGet } from "../../lib/useAxios";
import Spinner from "components/Spinner";
import ReviewCard from "../ReviewCard";
import { Camera, Edit3, User } from "react-feather";
import ReactSelect from "react-select";
import { useRateRestaurant } from "components/context/RateRestaurantProvider";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "components/Button";
import RatingPill from "../RatingPill";
import { countBy, sum } from "lodash";
import Color from "color";
import { ratingColors } from "../../data/ratingColors";
import { DataRing } from "components/display/DataRing";
import cheese1 from "assets/icons/cheese1.svg";
import fries from "assets/icons/fries.svg";
import sauce from "assets/icons/sauce.svg";
import classNames from "classnames";

const ReviewStats = ({ reviews, restaurant }) => {
  const { push } = useRouter();

  const counts = countBy(reviews, (r) => Math.floor(r.finalRating));
  const reviewStats = [...Array(11)].map((_, i) => counts[i] || 0);

  return (
    <div>
      <div
        className={classNames("flex items-center justify-between", {
          "sm:mb-3": restaurant.reviews.length > 0,
        })}
      >
        <div
          className={classNames(
            "px-2 sm:px-0 flex flex-wrap w-full pt-1 justify-between items-baseline",
            {
              "sm:mb-2": restaurant.reviews.length > 0,
            }
          )}
        >
          <h2 className="px-1 pl-1 mr-5 text-gray-700">
            {reviews.length > 0 ? (
              <span className="text-lg sm:text-xl">
                Avis ({reviews.length})
              </span>
            ) : (
              <p className="mb-2">
                Soyez la première personne à laisser un avis!
              </p>
            )}
          </h2>

          <Button
            height="sm"
            onClick={() => push(`/restaurants/${restaurant._id}/noter`)}
            className="flex items-center px-4 shrink-0 text-sm sm:text-md h-[35px] sm:h-[40px]"
            variant="primary"
          >
            <Edit3 className="mr-2 sm:text-lg w-4 sm:w-5" />
            Noter {restaurant.name}
          </Button>
        </div>
      </div>

      {reviews.length > 100 && (
        <div className="flex items-center">
          <div className="flex">
            {reviewStats.map((n, i) => {
              return (
                <div key={i} className="flex flex-col items-center mb-[1px]">
                  <div className="w-[32px] h-[100px] bg-gray-50 border-r border-white flex items-end">
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: (n / sum(reviewStats)) * 100 + "%",
                        backgroundColor: Color(ratingColors[i]).darken(0.3),
                      }}
                    ></div>
                  </div>
                  <div className="text-gray-500 h-10 text-right mt-1 text-sm">
                    {i}
                  </div>
                  {/* <div>{n}</div> */}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const RestaurantReviews = ({ restaurant }) => {
  const { data: reviews, loading } = useGet(
    `/api/restaurants/${restaurant._id}/reviews`
  );

  const { reload } = useRouter();
  const { rateRestaurant } = useRateRestaurant();

  if (loading) return <Spinner />;

  const handleEdit = (review) => {
    rateRestaurant(restaurant, review);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Êtes-vous sûr(e) de vouloir supprimer l'avis? Cette action est irréversible."
      )
    ) {
      await axios
        .delete(`/api/reviews/${id}/delete`)
        .then(() => {
          toast.success("Supprimé!");
          reload(window.location.pathname);
        })
        .catch((e) => toast.error(e.message));
    }
  };

  return (
    <div className="pr-2 pb-2 pl-2 lg:pr-5 lg:pb-5 lg:pl-5 sm:w-auto bg-white shadow-md rounded-lg">
      <div
        className={classNames(
          "sticky top-0 bg-white pt-3 sm:pt-4 sm:pl-4 sm:pr-4 z-10",
          { "border-b pb-2": restaurant.reviews.length > 0 }
        )}
      >
        <ReviewStats reviews={reviews} restaurant={restaurant} />
      </div>
      {/* New stats, not sticky */}

      {reviews.map((r, i) => (
        <ReviewCard
          key={r._id}
          review={r}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          isFirst={i === 0}
        />
      ))}
    </div>
  );
};

export default RestaurantReviews;
