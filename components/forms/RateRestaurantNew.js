import React from "react";
import axios from "axios";
import Field from "components/Field";
import { ratingColors } from "data/ratingColors";
import RatingButtons from "components/controls/RatingButtons";
import Button from "components/Button";
import ImageUpload from "components/controls/ImageUpload";
import * as Yup from "yup";
import Form from "components/Form";
import toast from "react-hot-toast";
import Color from "color";
import { formatRating } from "lib/formatRating";
import { Check } from "react-feather";
import { useCookies } from "react-cookie";
import { useSidebarData } from "components/context/SidebarDataProvider";
import { useCurrentUser } from "lib/useCurrentUser";
import { filterBlankRatings } from "lib/filterBlankRatings";
import { MIN_COMMENT_CHARS } from "../../data/minCommentLength";
import { AlmostThere } from "../display/messages/AlmostThere";
import { useLoginForm } from "../context/LoginFormProvider";
import classNames from "classnames";

const ratingFields = [
  {
    name: "friesRating",
    label: (
      <>
        <span className="text-xl relative top-[1px] mr-[7px]">🍟</span>Frites
      </>
    ),
  },
  {
    name: "cheeseRating",
    label: (
      <>
        <span className="text-xl relative top-[1px] mr-[7px]">🧀</span>Fromage
      </>
    ),
  },
  {
    name: "sauceRating",
    label: (
      <>
        <span className="text-xl relative top-[1px] mr-[7px]">🍯</span>Sauce
      </>
    ),
  },
  {
    name: "portionRating",
    label: (
      <>
        <span className="text-xl relative top-[1px] mr-[7px]">🤑</span>Rapport
        portion/prix
      </>
    ),
  },
];

const buildRatingValidation = (label) =>
  Yup.number(label)
    .transform((value) => (isNaN(value) ? null : value))
    .typeError("Amount must be a number")
    .min(0)
    .max(10)
    .nullable();

const validationSchema = Yup.object({
  friesRating: buildRatingValidation("Choisissez une note"),
  cheeseRating: buildRatingValidation("Choisissez une note"),
  sauceRating: buildRatingValidation("Choisissez une note"),
  portionRating: buildRatingValidation("Choisissez une note"),
  title: Yup.string().min(3),
  comment: Yup.string().min(
    MIN_COMMENT_CHARS,
    `Dites-nous en un peu plus 😥 (au moins ${MIN_COMMENT_CHARS} caractères)`
  ),
  photos: Yup.array().nullable(),
});

const FinalRating = ({ avgRating }) =>
  avgRating > 0 && (
    <div className="flex items-center text-gray-500 border-gray-300 rounded my-6 bg-gray-100 p-6 justify-center">
      <div className="mr-2">Note finale:</div>
      <div>
        <span
          className="py-[2px] px-[8px] bg-green-200 rounded mr-2 text-xl sm:text-2xl text-white flex items-center font-bold shadow-lg"
          style={{
            backgroundColor: Color(ratingColors[Math.floor(avgRating)])
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
  );

const ErrorMessage = ({ condition, message }) => {
  if (!condition) return null;
  return <div className="text-red-600 text-sm">{message}</div>;
};

export const RateRestaurantNew = ({
  onSubmit,
  restaurantId,
  existingReview,
  loading,
}) => {
  const { currentUser } = useCurrentUser();
  const {
    sidebarWatchlistAmount,
    setSidebarWatchlistAmount,
    sidebarEatenlistAmount,
    setSidebarEatenlistAmount,
  } = useSidebarData();
  const { openLogin } = useLoginForm();

  const [cookies, setCookies, removeCookies] = useCookies();

  const handleSubmit = async (values) => {
    if (!currentUser) {
      setCookies("reviewInProgress", values);
      setCookies("reviewRestaurantInProgress", restaurantId);
      openLogin({ message: <AlmostThere /> });
      return;
    }

    const ratingValues = filterBlankRatings(values);
    const finalRating =
      ratingValues.length > 0
        ? ratingValues.reduce((a, b) => a + b) / ratingValues.length
        : undefined;

    const submitValues = {
      ...values,
      finalRating,
      restaurantId,
    };

    const url = existingReview
      ? `/api/reviews/${existingReview._id}/update`
      : "/api/reviews/create";
    const toastMessage = existingReview ? "Modifié!" : "Avis publié!";

    const formData = new FormData();
    for (const key in submitValues) {
      if (key === "photos" && submitValues[key]) {
        for (const [index, file] of submitValues[key].entries()) {
          formData.append(`photos[${index}]`, file);
        }
      } else {
        formData.append(key, submitValues[key]);
      }
    }

    try {
      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(toastMessage);
      removeCookies("reviewInProgress");
      removeCookies("reviewRestaurantInProgress");

      if (!currentUser.eatenlist.includes(restaurantId)) {
        setSidebarEatenlistAmount(sidebarEatenlistAmount + 1);
      }
      if (currentUser.watchlist.includes(restaurantId)) {
        setSidebarWatchlistAmount(sidebarWatchlistAmount - 1);
      }

      onSubmit && onSubmit();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const initialValues = existingReview ||
    (cookies.reviewRestaurantInProgress === restaurantId &&
      cookies.reviewInProgress) || {
      friesRating: null,
      cheeseRating: null,
      sauceRating: null,
      portionRating: null,
      title: "",
      comment: "",
      photos: [],
    };

  if (!cookies) return;

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      className={classNames("sm:w-[460px]", {
        "opacity-50 animate-pulse cursor-wait": loading,
      })}
    >
      {({ isSubmitting, values, errors, touched }) => {
        const nbFilledFields = ratingFields
          .map((field) => values[field.name])
          .filter((v) => v).length;
        const avgRating =
          nbFilledFields > 0
            ? ratingFields
                .map((field) => values[field.name])
                .reduce((a, b) => a + b, 0) / nbFilledFields
            : null;

        const disableSubmitBtn =
          loading ||
          (nbFilledFields === 0 && values.comment.trim().length === 0);

        return (
          <>
            {existingReview && (
              <h2 className="font-black text-2xl mb-5 text-center">
                Modifier ton avis
              </h2>
            )}
            {ratingFields.map((field) => (
              <Field
                key={field.name}
                className="sm:mb-5"
                name={field.name}
                label={field.label}
                control={RatingButtons}
              />
            ))}

            <FinalRating avgRating={avgRating} />

            <Field
              className="sm:mb-5"
              name="comment"
              label="Commentaire"
              type="textarea"
            />
            <Field
              name="photos"
              control={ImageUpload}
              isMulti={true}
              label="Photos"
            />

            <ErrorMessage
              condition={errors.rating && touched.rating}
              message="Vous devez choisir au moins une note sur 10"
            />
            <ErrorMessage
              condition={errors.comment && touched.comment}
              message={`Le commentaire est trop court (au moins ${MIN_COMMENT_CHARS} caractères)`}
            />
            <ErrorMessage
              condition={disableSubmitBtn && touched.comment}
              message={`Veuillez noter la poutine ou ajouter un commentaire pour publier l'avis.`}
            />

            <div className="flex items-center justify-center pt-6 pb-3 mt-6 border-t">
              <Button
                type="submit"
                variant="primary"
                className="w-60"
                loading={isSubmitting}
                disabled={disableSubmitBtn}
              >
                <Check className="mr-2" size={18} />
                Publier
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
};
