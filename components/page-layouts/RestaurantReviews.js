import { useRouter } from "next/router";
import React, { useState } from "react";
import { useGet } from "../../lib/useAxios";
import Spinner from "components/Spinner";
import ReviewCard from "../ReviewCard";
import { Camera, Edit3 } from "react-feather";
import ReactSelect from "react-select";
import { useRateRestaurant } from "components/context/RateRestaurantProvider";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "components/Button";
import RatingPill from "../RatingPill";
import { countBy, sum } from "lodash";
import Color from "color";
import { ratingColors } from "../../data/ratingColors";

const ReviewStats = ({ reviews, restaurant }) => {
  const { push } = useRouter();

  const counts = countBy(reviews, (r) => Math.floor(r.rating));
  const reviewStats = [...Array(11)].map((_, i) => counts[i] || 0);

  return (
    <div>
      <div className="flex items-center justify-between sm:mb-3">
        <div className="px-2 sm:px-0 flex w-full mb-2 pt-1 justify-between items-baseline">
          <h2 className="px-1 pl-1 text-xl mr-5 text-gray-700">
            {reviews.length > 0 ? (
              <>Avis ({reviews.length})</>
            ) : (
              "Soyez la première personne à laisser un avis!"
            )}
          </h2>
          {/* <ReactSelect placeholder='trier par' options={[]} /> */}
          {/* <ReactSelect placeholder='langue' options={[]} className='ml-3' /> */}

          {/* <Button
              size='sm'
              variant='secondary'
              onClick={() => rateRestaurant(restaurant)}
              className='flex items-center mr-2'
            >
              <Camera size={20} className='mr-1' />
              Poster une photo
            </Button> */}
          <Button
            height="sm"
            onClick={() => push(`/restaurants/${restaurant._id}/noter`)}
            className="flex items-center px-4 "
            variant="primary"
          >
            <Edit3 size={20} className="mr-2" />
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
          {/* <div className='ml-4 -mt-8 text-gray-500 text-sm'>Distribution des notes sur 10</div> */}
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
    <div className="p-2 lg:p-5 pt-8 w-screen sm:w-auto">
      <div className="sticky top-0 bg-white border-b pt-2 pr-2 pl-2 sm:pt-4 sm:pl-4 sm:pr-4 z-10">
        <ReviewStats reviews={reviews} restaurant={restaurant} />
      </div>

      {reviews.map((r) => (
        <ReviewCard
          key={r._id}
          review={r}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default RestaurantReviews;
