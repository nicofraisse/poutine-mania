import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGet } from "lib/useAxios";
import { useRouter } from "next/router";
import Spinner from "components/Spinner";
import Field from "components/Field";
import { ratingColors } from "../../../data/ratingColors";
import RatingButtons from "../../../components/controls/RatingButtons";
import Button from "../../../components/Button";
import ImageUpload from "../../../components/controls/ImageUpload";
import * as Yup from "yup";
import Form from "../../../components/Form";
import toast from "react-hot-toast";
import Color from "color";
import { round } from "lodash";
import { formatRating } from "../../../lib/formatRating";
import { Plus, MinusCircle, Check } from "react-feather";
import classNames from "classnames";
import { useCookies } from "react-cookie";

import { useCurrentUser } from "../../../lib/useCurrentUser";
import { useLoginForm } from "components/context/LoginFormProvider";
import { ErrorMessage } from "formik";

const AlmostThere = () => (
  <div className="text-center">
    <h2 className="text-xl font-bold">Vous y êtes presque!</h2>
    <p className="text-sm max-w-[320px] text-gray-600 my-2">
      Connectez-vous pour profiter de toutes les fonctionalités de Poutine Mania
    </p>
  </div>
);

const MIN_COMMENT_CHARACTERS = 20;

const NoterRestaurant = () => {
  const [showDetailedRatings, setShowDetailedRatings] = useState(false);
  const [cookies, setCookies, removeCookies] = useCookies();

  const { query, push } = useRouter();
  const { currentUser } = useCurrentUser();
  const { openLogin } = useLoginForm();

  const { data: restaurant, loading } = useGet(`/api/restaurants/${query.id}`, {
    skip: !query.id,
  });

  const uploadToCloudinary = async (files) => {
    if (!files || files.length === 0) return null;
    if (typeof files?.[0] === "string") return "skip";
    const formData = new FormData();
    for (const file of files) {
      formData.append("file", file);
    }
    formData.append("upload_preset", "bsmn0mmd");
    const { data } = await axios.post(
      "https://api.cloudinary.com/v1_1/dhqv0jl8c/image/upload",
      formData
    );
    return data.public_id;
  };

  const handleSubmit = async (values) => {
    if (!currentUser) {
      setCookies("reviewInProgress", values);
      setCookies("reviewRestaurantInProgress", query.id);
      openLogin(<AlmostThere />);
      return;
    }

    // Temp
    const existingReview = null;
    const publicId = await uploadToCloudinary(values.photos);
    const submitValues = {
      ...values,
      ...(publicId !== "skip" && { photos: publicId ? [publicId] : null }),
      restaurantId: restaurant._id,
    };
    const url = existingReview
      ? `/api/reviews/${existingReview._id}/update`
      : "/api/reviews/create";
    const toastMessage = existingReview ? "Modifié!" : "Avis publié!";
    try {
      await axios.post(url, submitValues);
      toast.success(toastMessage);
      removeCookies("reviewInProgress");
      removeCookies("reviewRestaurantInProgress");
      push(`/noter?fromRateSuccess=${restaurant._id}`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleClickCriteriaButton = (setFieldValue, values) => {
    if (showDetailedRatings) {
      if (
        values.friesRating !== null ||
        values.cheeseRating !== null ||
        values.sauceRating !== null ||
        values.portionRating !== null ||
        values.serviceRating !== null
      ) {
        if (
          window.confirm(
            "Êtes vous sûr(e)? Cela supprimera vos critères de notations."
          )
        ) {
          setFieldValue("friesRating", null);
          setFieldValue("cheeseRating", null);
          setFieldValue("sauceRating", null);
          setFieldValue("portionRating", null);
          setFieldValue("serviceRating", null);
          setShowDetailedRatings(false);
        }
      } else setShowDetailedRatings(false);
    } else setShowDetailedRatings(true);
  };

  if (loading || !restaurant || !cookies) return <Spinner />;
  return (
    <div className="p-4 sm:p-10 max-w-xs ">
      <h1 className="text-xl font-black mb-2">
        Noter <span>{restaurant.name}</span>
      </h1>

      <Form
        initialValues={
          (cookies.reviewRestaurantInProgress === query.id &&
            cookies.reviewInProgress) || {
            rating: null,
            friesRating: null,
            cheeseRating: null,
            sauceRating: null,
            portionRating: null,
            serviceRating: null,
            title: "",
            comment: "",
            photos: [],
          }
        }
        validateOnChange={false}
        validateOnBlur={true}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          rating: Yup.number("Choisissez une note")
            .transform((value) => (isNaN(value) ? null : value))
            .typeError("Requis")
            .min(0)
            .max(10)
            .required("Requis"),
          friesRating: Yup.number("Choisissez une note")
            .transform((value) => (isNaN(value) ? null : value))
            .typeError("Amount must be a number")
            .min(0)
            .max(10)
            .nullable(),
          cheeseRating: Yup.number("Choisissez une note")
            .transform((value) => (isNaN(value) ? null : value))
            .typeError("Amount must be a number")
            .min(0)
            .max(10)
            .nullable(),
          sauceRating: Yup.number("Choisissez une note")
            .transform((value) => (isNaN(value) ? null : value))
            .typeError("Amount must be a number")
            .min(0)
            .max(10)
            .nullable(),
          portionRating: Yup.number("Choisissez une note")
            .transform((value) => (isNaN(value) ? null : value))
            .typeError("Amount must be a number")
            .min(0)
            .max(10)
            .nullable(),
          serviceRating: Yup.number("Choisissez une note")
            .transform((value) => (isNaN(value) ? null : value))
            .typeError("Amount must be a number")
            .min(0)
            .max(10)
            .nullable(),
          title: Yup.string().min(3),
          comment: Yup.string().min(
            MIN_COMMENT_CHARACTERS,
            `Dites-nous en un peu plus 😥 (au moins ${MIN_COMMENT_CHARACTERS} caractères)`
          ),
          photos: Yup.object().nullable(),
        })}
      >
        {({ isSubmitting, values, errors, setFieldValue, touched }) => {
          const nbFilledFields = [
            values.rating,
            values.serviceRating,
            values.portionRating,
            values.friesRating,
            values.cheeseRating,
            values.sauceRating,
          ].filter((v) => v).length;
          const avgRating =
            (values.serviceRating +
              values.portionRating +
              values.friesRating +
              values.cheeseRating +
              values.sauceRating +
              values.rating) /
            nbFilledFields;

          return (
            <>
              <div className="font-bold text-xl mb-4 sm:mb-6"></div>

              <Field
                className="sm:mb-5"
                name="rating"
                label="Note globale"
                control={RatingButtons}
              />

              <div
                className={classNames({
                  block: showDetailedRatings,
                  hidden: !showDetailedRatings,
                })}
              >
                <Field
                  className="sm:mb-5"
                  name="friesRating"
                  label="Frites"
                  control={RatingButtons}
                />
                <Field
                  className="sm:mb-5"
                  name="cheeseRating"
                  label="Fromage"
                  control={RatingButtons}
                />
                <Field
                  className="sm:mb-5"
                  name="sauceRating"
                  label="Sauce"
                  control={RatingButtons}
                />
                <Field
                  className="sm:mb-5"
                  name="portionRating"
                  label="Rapport portion/prix"
                  control={RatingButtons}
                />
                <Field
                  className="sm:mb-5"
                  name="serviceRating"
                  label="Service"
                  control={RatingButtons}
                />
              </div>

              <button
                onClick={() => handleClickCriteriaButton(setFieldValue, values)}
                className="text-sm my-4 flex items-center justify-center text-gray-400 px-6 py-1 border-2 border-gray-300 rounded-full"
                type="button"
              >
                {showDetailedRatings ? (
                  <MinusCircle className="mr-1" size={18} />
                ) : (
                  <Plus className="mr-1" size={20} />
                )}
                {showDetailedRatings ? "Enlever tous les" : "Ajouter des"}{" "}
                critères de notation
              </button>
              {avgRating > 0 && (
                <div className="flex items-center text-gray-500 border-gray-300 rounded my-6 bg-gray-100 p-6 justify-center">
                  <div className="mr-2">Votre note finale:</div>
                  <div>
                    <span
                      className="py-[2px] px-[8px] bg-green-200 rounded mr-2 text-xl sm:text-2xl text-white flex items-center font-bold shadow-lg"
                      style={{
                        backgroundColor: Color(ratingColors[round(avgRating)])
                          .darken(0.3)
                          .desaturate(0.3),
                      }}
                    >
                      {formatRating(avgRating) || "?"}
                      <span className="text-white font-normal text-sm sm:text-base text-opacity-80 ml-[2px] -mb-[2px]">
                        /10
                      </span>
                    </span>
                  </div>
                </div>
              )}
              <Field
                className="sm:mb-5"
                name="comment"
                label="Commentaire"
                type="textarea"
              />
              <Field name="photos" control={ImageUpload} label="Photo" />
              {errors.rating && touched.rating && (
                <div className="text-red-600 text-sm">
                  Vous devez choisir au moins une note sur 10
                </div>
              )}
              {errors.comment && touched.comment && (
                <div className="text-red-600 text-sm">
                  Le commentaire est trop court (au moins 20 caractères)
                </div>
              )}

              <div className="flex items-center justify-center pt-6 pb-3  mt-6 border-t">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-60"
                  loading={isSubmitting}
                >
                  <Check className="mr-2" size={18} />
                  Publier
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </div>
  );
};

export default NoterRestaurant;
