import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useGet } from "../../lib/useAxios";
import Spinner from "components/Spinner";
import ReviewCard from "../ReviewCard";
import { CheckCircle, Info, Star } from "react-feather";
import { useRateRestaurant } from "components/context/RateRestaurantProvider";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "components/Button";
import { countBy, sum } from "lodash";
import Color from "color";
import { ratingColors } from "../../data/ratingColors";

import classNames from "classnames";
import { useCurrentUser } from "lib/useCurrentUser";
import { useSidebarData } from "components/context/SidebarDataProvider";
import Modal from "react-responsive-modal";
import { useRequireLogin } from "../../lib/useRequireLogin";
import Link from "next/link";

const ReviewStats = ({ reviews, restaurant }) => {
  const { currentUser } = useCurrentUser();
  const requireLogin = useRequireLogin();

  const counts = countBy(reviews, (r) => Math.floor(r.finalRating));
  const reviewStats = [...Array(11)].map((_, i) => counts[i] || 0);
  const [isEaten, setIsEaten] = useState(false);
  const [isWatch, setIsWatch] = useState(false);
  const [isEatenLoading, setIsEatenLoading] = useState(true);
  const [isWatchLoading, setIsWatchLoading] = useState(true);
  const {
    sidebarWatchlistAmount,
    setSidebarWatchlistAmount,
    sidebarEatenlistAmount,
    setSidebarEatenlistAmount,
  } = useSidebarData();

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

  const handleToggleFromEatenlist = () => {
    setIsEatenLoading(true);

    axios
      .post(`/api/users/${currentUser._id}/update-eatenlist`, {
        type: isEaten ? "remove" : "add",
        restaurantId: restaurant._id,
      })
      .then(() => {
        setIsEatenLoading(false);
        setIsEaten(!isEaten);
        toast.success(
          isEaten ? (
            "Supprimé des poutines mangées!"
          ) : (
            <>
              Ajouté aux
              <Link href="/mes-poutines">
                <span className="underline text-blue-500 ml-1">
                  poutines mangées
                </span>
              </Link>
              !
            </>
          )
        );

        if (isWatch) {
          setSidebarWatchlistAmount(sidebarWatchlistAmount - 1);
          setIsWatch(false);
        }
        setSidebarEatenlistAmount(
          isEaten ? sidebarEatenlistAmount - 1 : sidebarEatenlistAmount + 1
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
      .then(() => {
        setIsWatchLoading(false);
        setIsWatch(!isWatch);
        toast.success(
          isWatch ? (
            "Supprimé des poutines à essayer!"
          ) : (
            <>
              Ajouté aux
              <Link href="/a-essayer">
                <span className="underline text-blue-500 ml-1">
                  poutines à essayer
                </span>
              </Link>
              !
            </>
          )
        );
        setSidebarWatchlistAmount(
          isWatch ? sidebarWatchlistAmount - 1 : sidebarWatchlistAmount + 1
        );
        if (isEaten) {
          setSidebarEatenlistAmount(sidebarEatenlistAmount - 1);
          setIsEaten(false);
        }
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
            "px-2 sm:px-0 flex items-center flex-wrap w-full pt-1 justify-between ",
            {
              "mb-2 sm:mb-0": restaurant.reviews.length > 0,
            }
          )}
        >
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
              <p className="mb-2 text-sm">
                Soyez la première personne à laisser un avis!
              </p>
            )}
          </h2>

          <div className="">
            <Button
              height="sm"
              onClick={() =>
                requireLogin(
                  handleAddToWatchlist,
                  <div className="px-4 sm:w-[380px] ">
                    <div className="py-2 px-3 my-2 bg-blue-100 text-gray-700 rounded">
                      {/* <Info size={18} className='text-gray-700 inline mr-2' /> */}
                      <b>Connectez-vous</b> pour ajouter cette poutine à votre
                      liste à essayer!
                    </div>
                  </div>
                )
              }
              className={classNames(
                "inline-flex mr-2 items-center px-4 shrink-0 text-sm sm:text-md h-[35px] sm:h-[40px]",
                {
                  // "bg-gray-50": !isWatch,
                  "border-yellow-400 text-yellow-500": isWatch,
                  "text-gray-300 bg-gray-100": isEaten,
                }
              )}
              style={{ backgroundColor: "white" }}
              variant="light"
              loading={isWatchLoading}
              disabled={isEaten}
            >
              <Star
                className={classNames("mr-2 sm:text-lg w-4 sm:w-5", {
                  "fill-yellow-400 text-yellow-400": isWatch,
                })}
              />
              <span>À Essayer</span>
            </Button>
            <Button
              height="sm"
              onClick={() =>
                requireLogin(
                  handleToggleFromEatenlist,
                  <div className="px-4 sm:w-[380px] ">
                    <div className="py-2 px-3 my-2 bg-blue-100 border--200 text-gray-700 rounded borer">
                      {/* <Info size={18} className='text-gray-700 inline mr-2' /> */}
                      <b>Connectez-vous</b> pour ajouter cette poutine à votre
                      liste de poutines mangées!
                    </div>
                  </div>
                )
              }
              className={classNames(
                "inline-flex items-center px-4 shrink-0 text-sm sm:text-md h-[35px] sm:h-[40px]",
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
              <span>J&apos;ai mangé</span>
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
  const { currentUser } = useCurrentUser();
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleteFromEatenlist, setDeleteFromEatenlist] = useState(false);
  const isOnlyReview = currentUser
    ? reviews?.filter((r) => r.userId === currentUser._id)?.length === 1
    : false;

  useEffect(() => {
    setDeleteFromEatenlist(isOnlyReview);
  }, [isOnlyReview]);

  if (loading) return <Spinner />;

  const handleEdit = (review) => {
    rateRestaurant(restaurant, review);
  };

  const handleDelete = async () => {
    await axios
      .delete(
        `/api/reviews/${reviewToDelete._id}/delete?deleteFromEatenlist=${deleteFromEatenlist}&userId=${reviewToDelete.userId}&restaurantId=${reviewToDelete.restaurantId}`,
        { a: 9 }
      )
      .then(() => {
        toast.success("Supprimé!");
        reload(window.location.pathname);
      })
      .catch((e) => toast.error(e.message));
  };

  return (
    <div className="xs:pr-2 pb-2 xs:pl-2 lg:pr-5 lg:pb-5 lg:pl-5 sm:w-auto bg-white xs:shadow-md rounded-lg text-slate-600">
      <Modal
        open={reviewToDelete}
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
        onClose={() => {
          setReviewToDelete(null);
          setDeleteFromEatenlist(true);
        }}
      >
        <div className="w-xs p-2">
          <div className="text-3xl font-black mb-3">Supprimer l&apos;avis?</div>
          <div className="text-slate-400 mb-4 border border-slate-300 text-sm bg-slate-50 p-2 rounded my-2 flex items-center">
            <Info className="inline mr-2" size={16} />
            <span>Cette action est irréversible.</span>
          </div>
          {isOnlyReview && (
            <div>
              <input
                type="checkbox"
                id="deleteFromEatenlist"
                checked={deleteFromEatenlist}
                onChange={() => setDeleteFromEatenlist(!deleteFromEatenlist)}
                className="mr-2"
              />
              <label htmlFor="deleteFromEatenlist">
                Supprimer des poutines mangées
              </label>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button
              height="sm"
              width="sm"
              variant="light"
              onClick={() => setReviewToDelete(null)}
            >
              Annuler
            </Button>
            <Button
              height="sm"
              width="sm"
              variant="danger"
              className="ml-3"
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
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
          handleDelete={() => setReviewToDelete(r)}
          isFirst={i === 0}
          restaurantName={restaurant.name}
        />
      ))}
    </div>
  );
};

export default RestaurantReviews;
