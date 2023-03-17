import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, Check } from "react-feather";
import toast from "react-hot-toast";
import { useGet } from "../../lib/useAxios";
import Button from "../Button";
import Form from "components/Form";
import Field from "components/Field";
import SelectRestaurant from "./SelectRestaurant";
import Input from "components/Input";
import * as Yup from "yup";
import RatingButtons from "../controls/RatingButtons";
import ImageUpload from "../controls/ImageUpload";
import { useCurrentUser } from "lib/useCurrentUser";
import Spinner from "../Spinner";
import Color from "color";
import { ratingColors } from "../../data/ratingColors";
import { round } from "lodash";
import { formatRating } from "../../lib/formatRating";
import { MIN_COMMENT_CHARS } from "../../pages/restaurants/[id]/noter";
import { useRouter } from "next/router";
import { uploadToCloudinary } from "../../lib/uploadToCloudinary";

const RateRestaurant = ({ preselectedRestaurant, existingReview }) => {
  const router = useRouter();

  const [selectedRestaurant, setSelectedRestaurant] = useState(
    preselectedRestaurant || null
  );

  const { currentUser } = useCurrentUser();

  const handleSubmit = async (values) => {
    const ratingValues = [
      values.friesRating,
      values.cheeseRating,
      values.sauceRating,
      values.portionRating,
    ].filter(Boolean);

    const finalRating =
      ratingValues.reduce((a, b) => a + b) / ratingValues.length;
    const publicId = await uploadToCloudinary(values.photos);
    const submitValues = {
      ...values,
      finalRating,

      ...(publicId !== "skip" && { photos: publicId ? [publicId] : null }),
      restaurantId: selectedRestaurant._id,
    };
    const url = existingReview
      ? `/api/reviews/${existingReview._id}/update`
      : "/api/reviews/create";
    const toastMessage = existingReview ? "Modifié!" : "Avis publié!";
    try {
      await axios.post(url, submitValues);
      toast.success(toastMessage);

      setTimeout(() => {
        router.reload(window.location.pathname), 1500;
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Form
      initialValues={
        existingReview || {
          friesRating: null,
          cheeseRating: null,
          sauceRating: null,
          portionRating: null,
          comment: "",
          photos: [],
        }
      }
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

        comment: Yup.string().min(
          MIN_COMMENT_CHARS,
          `Dites-nous en un peu plus 😥 (au moins ${MIN_COMMENT_CHARS} caractères)`
        ),
        photos: Yup.object().nullable(),
      })}
      className="sm:px-2 pb-3 sm:w-[600px]"
    >
      {({ isSubmitting, values, errors, touched }) => {
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
            <div className="font-bold text-lg xs:text-xl mb-4 sm:mb-6">
              {existingReview ? "Modifier votre " : "Laissez un "}
              avis sur la poutine de{" "}
              <span className="font-black text-orange-800">
                {selectedRestaurant.name || preselectedRestaurant.name}
              </span>
            </div>
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
                <div className="mr-2">Note finale:</div>
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

            <div className="flex items-center justify-between mt-6">
              {existingReview ? (
                <div></div>
              ) : (
                <button className="flex items-center rounded text-gray-400 hover:text-gray-700">
                  <ChevronLeft className="mr-2" size={20} />
                  Noter un autre restaurant
                </button>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-60"
                loading={isSubmitting}
              >
                {existingReview ? "Mettre à jour" : "Soumettre"}
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
};

export default RateRestaurant;
