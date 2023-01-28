import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useGet } from "../../lib/useAxios";
import Spinner from "components/Spinner";
import ReviewCard from "../ReviewCard";
import {
  Bookmark,
  Camera,
  CheckCircle,
  Edit3,
  Star,
  ThumbsUp,
  User,
} from "react-feather";
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
import { useCurrentUser } from "lib/useCurrentUser";

const ReviewStats = ({ reviews, restaurant }) => {
  const { push } = useRouter();
  const { currentUser } = useCurrentUser();

  const counts = countBy(reviews, (r) => Math.floor(r.finalRating));
  const reviewStats = [...Array(11)].map((_, i) => counts[i] || 0);
  const [isEaten, setIsEaten] = useState(false);
  const [isWatch, setIsWatch] = useState(false);
  const [isEatenLoading, setIsEatenLoading] = useState(true);
  const [isWatchLoading, setIsWatchLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.eatenlist) {
      setIsEaten(currentUser.eatenlist.includes(restaurant._id));
    }
    if (currentUser && currentUser.watchlist) {
      setIsWatch(currentUser.watchlist.includes(restaurant._id));
    }
    setIsEatenLoading(false);
    setIsWatchLoading(false);
  }, [currentUser, restaurant._id]);

  const handleAddToEatenlist = () => {
    setIsEatenLoading(true);

    axios
      .post(`/api/users/${currentUser._id}/update-eatenlist`, {
        type: isEaten ? "remove" : "add",
        restaurantId: restaurant._id,
      })
      .then(({ data }) => {
        setIsEatenLoading(false);
        setIsEaten(!isEaten);
        toast.success(
          isEaten
            ? "Supprimé des poutines mangées!"
            : "Ajouté aux poutines mangées!"
        );
      })
      .catch((e) => {
        toast.error("error", e.message);
        setIsEatenLoading(false);
      });
  };

  const handleAddToWatchlist = () => {
    setIsWatchLoading(true);

    axios
      .post(`/api/users/${currentUser._id}/update-watchlist`, {
        type: isWatch ? "remove" : "add",
        restaurantId: restaurant._id,
      })
      .then(({ data }) => {
        setIsWatchLoading(false);
        setIsWatch(!isWatch);
        toast.success(
          isWatch
            ? "Supprimé des poutines à essayer!"
            : "Ajouté aux poutines à essayer!"
        );
      })
      .catch((e) => {
        toast.error("error", e.message);
        setIsWatchLoading(false);
      });
  };

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
          <div>
            {/* <Button
              height="sm"
              onClick={() => push(`/restaurants/${restaurant._id}/noter`)}
              className="inline-flex mr-2 items-center px-4 shrink-0 text-sm sm:text-md h-[35px] sm:h-[40px]"
              variant="light"
            >
              <Edit3 className="mr-2 sm:text-lg w-4 sm:w-5" />
              Noter
            </Button> */}
            <h2 className="inline px-1 pl-1 mr-5 text-gray-700">
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
          </div>

          <div className="">
            <Button
              height="sm"
              onClick={handleAddToEatenlist}
              className={classNames(
                "inline-flex mr-2 items-center px-4 shrink-0 text-sm sm:text-md h-[35px] sm:h-[40px]",
                {
                  "": !isEaten,
                  "text-green-500 bg-green-50 border-green-200 hover:bg-green-50":
                    isEaten,
                }
              )}
              variant="light"
              loading={isEatenLoading}
            >
              <CheckCircle className="mr-2 sm:text-lg w-4 sm:w-5" />
              <span>J'ai mangé</span>
            </Button>
            <Button
              height="sm"
              onClick={handleAddToWatchlist}
              className={classNames(
                "inline-flex mr-2 items-center px-4 shrink-0 text-sm sm:text-md h-[35px] sm:h-[40px]",
                {
                  // "bg-gray-50": !isWatch,
                  // "text-yellow-500  border-yellow-400 hover:bg-yellow-50 bg-white":
                  //   isWatch,
                }
              )}
              variant="light"
              loading={isWatchLoading}
            >
              <Star
                className={classNames("mr-2 sm:text-lg w-4 sm:w-5", {
                  "fill-yellow-400 text-yellow-400": isWatch,
                })}
              />
              <span>À Essayer</span>
            </Button>
          </div>
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
