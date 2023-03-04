import Link from "next/link";
import React, { useState } from "react";
import { Edit3, X, MessageCircle, User } from "react-feather";
import Modal from "react-responsive-modal";
import { Image } from "./Image";
import RatingPill from "./RatingPill";
import { formatDate } from "lib/formatDate";
import { formatName } from "../lib/formatName";
import NextImage from "next/image";
import { useCurrentUser } from "../lib/useCurrentUser";
import { useRouter } from "next/router";
import { useRateRestaurant } from "components/context/RateRestaurantProvider";
import axios from "axios";
import toast from "react-hot-toast";

const ProfileReviewCard = ({ review, isIndex, userName }) => {
  console.log({ userName });
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const { currentUser } = useCurrentUser();
  const { reload } = useRouter();
  const { rateRestaurant } = useRateRestaurant();

  const handleEdit = (review) => {
    rateRestaurant(review.restaurants[0], review);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Êtes-vous sûr(e) de vouloir supprimer l'avis? Cette action est irréversible."
      )
    ) {
      await axios
        .delete(`/api/reviews/${id}/delete?userId=${review.user._id}`)
        .then(() => {
          toast.success("Supprimé!");
          reload(window.location.pathname);
        })
        .catch((e) => toast.error(e.message));
    }
  };

  if (!review.restaurants || review.restaurants.length === 0) return null;

  return (
    <>
      <div className="text-gray-400 block sm:flex justify-between items-center">
        <span>
          {isIndex ? (
            <>
              <div className="inline-block relative top-5 translate-y-[-15px] translate-x-[-6px]">
                {review.user.image ? (
                  <Image
                    alt="user-image"
                    src={review.user.image}
                    width={24}
                    height={24}
                    className="rounded-full object-cover object-center"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center translate-y-[-2px]">
                    <User className="text-white" size={16} />
                  </div>
                )}
              </div>
              <Link href={`/users/${review.user._id}`} passHref>
                <span className="font-bold hover:text-gray-500 cursor-pointer">
                  {formatName(review?.user)}{" "}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Edit3 size={20} className="mr-2 inline -mt-1" />
              {currentUser && currentUser._id === review.userId
                ? "Tu as"
                : `${userName} a`}
              &nbsp;
            </>
          )}
          noté
          <Link href={`/restaurants/${review.restaurants[0]._id}`}>
            <a className="text-teal-500 ml-[6px] font-bold hover:text-teal-600">
              {review.restaurants[0].name}
            </a>
          </Link>
        </span>
        <span className="text-gray-400 text-sm ml-1 font-normal">
          <span className="inline sm:hidden">- le</span>{" "}
          {formatDate(review.createdAt, "d MMMM yyyy")}
        </span>
      </div>
      <div className="text-gray-700 mb mt-2 mb-8 border shadow-md rounded-md p-3 sm:p-4 bg-white">
        {/* <div className='flex items-center mb-2 pb-2'>
          <div className='px-2 w-full border-b pb-2 rounded-lg'>

            · Montréal, QC (11 avis)
          </div>
        </div> */}
        <div className="flex mb-2 ">
          <RatingPill
            avgRating={review.finalRating}
            reviewCount={1}
            single
            className="inline"
          />
          <span className="font-bold ml-2">{review.title}</span>
        </div>
        <p className="rounded-lg p-1 w-full ">{review.comment}</p>
        <div className="flex items-start">
          {review.photos?.[0] && (
            <Image
              src={review.photos?.[0]}
              alt="poutine-user-photo"
              width={1000}
              className="border rounded-md mr-3 mt-3"
              onClick={() => setImgModalOpen(true)}
            />
          )}
        </div>
        {(review.userId === currentUser?._id || currentUser?.isAdmin) && (
          <div className="mt-2">
            <button
              className="text-sm text-gray-400 hover:text-gray-500"
              onClick={() => handleEdit(review)}
            >
              Modifier
            </button>
            <span className="text-sm text-gray-400 font-normal mx-1">/</span>
            <button
              className="text-sm text-gray-400 hover:text-gray-500"
              onClick={() => handleDelete(review._id)}
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
      <Modal
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
        open={imgModalOpen}
        onClose={() => setImgModalOpen(false)}
        closeIcon={<X />}
        center
      >
        <div className="border w-full ">
          <Image
            src={review.photos?.[0]}
            alt="poutine-user-photo"
            width={"100%"}
            className="border rounded-md"
            onClick={() => setImgModalOpen(true)}
          />
        </div>
      </Modal>
    </>
  );
};

export default ProfileReviewCard;
