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
import RestaurantCard from "components/RestaurantCard";

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

export const MIN_COMMENT_CHARS = 20;

const NoterRestaurant = () => {
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
    const ratingValues = [
      values.friesRating,
      values.cheeseRating,
      values.sauceRating,
      values.portionRating,
    ].filter(Boolean);

    const finalRating =
      ratingValues.reduce((a, b) => a + b) / ratingValues.length;

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
      finalRating,
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

  if (loading || !restaurant || !cookies) return <Spinner />;
  return (
    <div className="p-4 sm:p-10 max-w-xs">
      <div className="-ml-4 -mr-4 xs:w-auto xs:mr-0 xs:ml-0 -mt-3 xs:mt-0 border-b xs:border rounded mb-4">
        <RestaurantCard restaurant={restaurant} />
      </div>
      <h1 className="text-lg xs:text-xl font-black mb-2">
        <span>Qu'avez-vous pensé(e) de leur poutine?</span>
      </h1>

      <Form
        initialValues={
          (cookies.reviewRestaurantInProgress === query.id &&
            cookies.reviewInProgress) || {
            friesRating: null,
            cheeseRating: null,
            sauceRating: null,
            portionRating: null,
            title: "",
            comment: "",
            photos: [],
          }
        }
        // validateOnChange={false}
        // validateOnBlur={true}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
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

          title: Yup.string().min(3),
          comment: Yup.string().min(
            MIN_COMMENT_CHARS,
            `Dites-nous en un peu plus 😥 (au moins ${MIN_COMMENT_CHARS} caractères)`
          ),
          photos: Yup.object().nullable(),
        })}
      >
        {({ isSubmitting, values, errors, setFieldValue, touched }) => {
          const nbFilledFields = [
            values.portionRating,
            values.friesRating,
            values.cheeseRating,
            values.sauceRating,
          ].filter((v) => v).length;
          const avgRating =
            (values.portionRating +
              values.friesRating +
              values.cheeseRating +
              values.sauceRating) /
            nbFilledFields;

          return (
            <>
              {/* <div className="mb-3">
                <button className="py-1 px-3 border">Mode simple</button>
                <button className="py-1 px-3 border">Mode expert</button>
              </div> */}

              {/* <Field
                className="sm:mb-5"
                name="rating"
                label="Note globale"
                control={RatingButtons}
              /> */}

              <div>
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
              </div>

              {avgRating > 0 && (
                <div className="flex items-center text-gray-500 border-gray-300 rounded my-6 bg-gray-100 p-6 justify-center">
                  <div className="mr-2">Note moyenne:</div>
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

              <div className="flex items-center justify-center pt-6 pb-3 mt-6 border-t">
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
