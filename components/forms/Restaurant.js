import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useRouter } from "next/dist/client/router";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import { useGet } from "lib/useAxios";
import Form from "components/Form";
import Field from "components/Field";
import AutocompleteSelect from "../../components/controls/AutocompleteSelect";
import CategorySelect from "../../components/controls/CategorySelect";
import { Spinner } from "../Spinner";
import { Plus, Trash, Camera } from "react-feather";
import { cloneDeep, isString } from "lodash";
import classNames from "classnames";
import PillSelect from "../controls/PillSelect";
import PhoneInput from "components/controls/PhoneInput";
import { useCurrentUser } from "../../lib/useCurrentUser";
import { useRestaurantPriceOptions } from "../../lib/useRestaurantPrices";
import { useTranslation } from "next-i18next";
import { MainPhotosModal } from "./MainPhotosModal";
import {
  getMainPhotos,
  getMainPhotosCount,
} from "../../lib/restaurantMainPhotos";
import { Image } from "../Image";
import Link from "next/link";

export const RestaurantForm = ({ type }) => {
  const { query, push } = useRouter();
  const { currentUser } = useCurrentUser();
  const priceOptions = useRestaurantPriceOptions();
  const { t } = useTranslation();

  const [succursales, setSuccursales] = useState([
    { address: "", phoneNumber: "" },
  ]);
  const [showMainPhotosModal, setShowMainPhotosModal] = useState(false);

  const { data: restaurant, loading } = useGet(`/api/restaurants/${query.id}`, {
    skip: !query.id,
  });

  const [localRestaurant, setLocalRestaurant] = useState(null);

  // Update local restaurant when data loads
  useEffect(() => {
    if (restaurant) {
      setLocalRestaurant(restaurant);
    }
  }, [restaurant]);

  const handleSubmit = (values, { setSubmitting }) => {
    if (succursales.find((s) => !s.address && !s.hide)) {
      setSubmitting(false);
      window.alert(t("restaurantForm.validation.emptyAddressAlert"));
      return;
    }

    const submitValues = {
      name: values.name,
      succursales: succursales.filter((s) => !s.hide),
      website: values.website,
      phoneNumber: values.phoneNumber,
      priceRange: values.priceRange,
      categories: values.categories.map((c) => (isString(c) ? c : c.value)),
    };

    if (type === "create") {
      axios
        .post("/api/restaurants/create", submitValues)
        .then(({ data }) => {
          toast.success("Succès");
          console.log({ data });
          push(
            currentUser.isAdmin
              ? "/admin/restaurants"
              : `/restaurants?createdRestaurantId=${data.restaurant?.slug}`
          );
        })
        .catch((err) => toast.error(err.response.data.error ?? err.message))
        .finally(() => setSubmitting(false));
    } else if (type === "update") {
      axios
        .post(`/api/restaurants/${query.id}/update`, submitValues)
        .then(() => {
          toast.success("Succès");
          push(
            currentUser.isAdmin
              ? `/admin/restaurants`
              : `/restaurants/${currentRestaurant.slug}`
          );
        })
        .catch((err) => toast.error(err.response.data.error ?? err.message))
        .finally(() => setSubmitting(false));
    }
  };

  const handleMainPhotosUpdate = (newMainPhotos) => {
    // Update the local restaurant data
    setLocalRestaurant((prev) => ({
      ...prev,
      mainPhotos: newMainPhotos,
    }));
  };
  const currentRestaurant = localRestaurant || restaurant;

  useEffect(() => {
    if (currentRestaurant?.succursales && succursales[0].address === "") {
      setSuccursales(currentRestaurant.succursales);
    }
  }, [currentRestaurant, succursales]);

  const updateSuccursaleField = (value, index, field) => {
    const succursalesCopy = cloneDeep(succursales);
    succursalesCopy[index][field] = value;
    setSuccursales(succursalesCopy);
  };

  if (loading || (type === "update" && !restaurant)) return <Spinner />;

  const initialValues = {
    name: type === "update" ? currentRestaurant.name : "",
    website: type === "update" ? currentRestaurant.website : "",
    priceRange: type === "update" ? currentRestaurant.priceRange : null,
    categories: type === "update" ? currentRestaurant.categories : [],
    "address-0": null,
    "phoneNumber-0": "",
  };

  if (type === "update") {
    currentRestaurant.succursales.forEach((succursale, index) => {
      initialValues[`address-${index}`] = {
        label: succursale.address.place_name,
        value: succursale.address,
      };
      initialValues[`phoneNumber-${index}`] = succursale.phoneNumber;
    });
  }

  const mainPhotosCount = currentRestaurant
    ? getMainPhotosCount(currentRestaurant)
    : 0;

  return (
    <>
      {type === "update" && (
        <Link
          href={`/restaurants/${currentRestaurant.slug}`}
          className="text-blue-500 hover:underline -mt-2 mb-3 block"
        >
          Voir le restaurant
        </Link>
      )}
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          name: Yup.string()
            .min(1)
            .max(50, t("restaurantForm.validation.name.max"))
            .required(t("validation.required")),
          categories: Yup.array()
            .min(1, t("restaurantForm.validation.categories"))
            .required(t("validation.required")),
          website: Yup.string().min(1),
          "address-0": Yup.object()
            .typeError(t("restaurantForm.validation.address"))
            .required("Requis"),
          "phoneNumber-0": Yup.string().optional(),
          priceRange: Yup.number()
            .nullable()
            .required(t("validation.required")),
        })}
      >
        {({ isSubmitting, values, errors, setFieldValue }) => (
          <>
            <Field name="name" label={t("restaurantForm.restaurantLabel")} />
            <Field
              name="categories"
              control={CategorySelect}
              label={t("restaurantForm.categoriesLabel")}
            />
            <Field
              name="priceRange"
              label={t("restaurantsFilters.priceTitle")}
              control={PillSelect}
              options={priceOptions}
              value={values.priceRange}
            />

            <div className="bg-gray-50 border p-3 sm:p-4 rounded mb-4">
              <label className="font-bold mb-2 text-sm block">
                {t("restaurantForm.succursalesLabel")}
              </label>
              {succursales.map((succursale, index) => (
                <div
                  key={index}
                  className={classNames(
                    "bg-white p-4 rounded mb-3 bg--50 relative shadow",
                    {
                      hidden: succursale.hide,
                    }
                  )}
                >
                  {index !== 0 && (
                    <Trash
                      className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                      size={18}
                      onClick={() => {
                        if (window.confirm("Supprimer la succursale?")) {
                          setFieldValue(`address-${index}`, {
                            label: "",
                            value: "",
                          });
                          setFieldValue(`phoneNumber-${index}`, "");
                          setSuccursales(
                            succursales.map((s, i) => {
                              if (i === index) {
                                return {
                                  address: "",
                                  phoneNumber: "",
                                  hide: true,
                                };
                              }
                              return s;
                            })
                          );
                        }
                      }}
                    />
                  )}
                  <Field
                    name={`address-${index}`}
                    onChange={(value) => {
                      setFieldValue(`address-${index}`, {
                        label: value.place_name,
                        value,
                      });
                      updateSuccursaleField(value, index, "address");
                    }}
                    control={AutocompleteSelect}
                    label={t("restaurantForm.addressLabel")}
                  />
                  <Field
                    name={`phoneNumber-${index}`}
                    label={t("restaurantForm.phoneLabel")}
                    value={succursale.phoneNumber}
                    onChange={(value) =>
                      updateSuccursaleField(value, index, "phoneNumber")
                    }
                    control={PhoneInput}
                    country="US"
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="light"
                size="sm"
                className="text-sm"
                height="sm"
                style={{ marginLeft: "auto" }}
                onClick={() =>
                  setSuccursales([
                    ...succursales,
                    { address: "", phoneNumber: "" },
                  ])
                }
              >
                <Plus size={20} className="mr-1" />
                {t("restaurantForm.addSuccursaleButton")}
              </Button>
            </div>

            {/* Main Photos Section - Only show for update mode */}
            {type === "update" && currentRestaurant && (
              <div className="bg-gray-50 border p-3 sm:p-4 rounded mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-sm">
                    Main Photos ({mainPhotosCount}/3)
                  </label>
                  <Button
                    type="button"
                    variant="light"
                    size="sm"
                    className="text-sm"
                    onClick={() => setShowMainPhotosModal(true)}
                  >
                    <Camera size={16} className="mr-1" />
                    Edit Main Photos
                  </Button>
                </div>

                {mainPhotosCount > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {getMainPhotos(currentRestaurant).map((photoId, index) => (
                      <div key={photoId} className="relative">
                        <Image
                          src={photoId}
                          alt="Restaurant photo"
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <div className="absolute top-1 left-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No main photos set. Photos will be automatically added from
                    reviews, or you can manually select them.
                  </p>
                )}
              </div>
            )}

            <Field name="website" label={t("restaurantForm.websiteLabel")} />
            <div className="flex items-center justify-between">
              <Button
                loading={isSubmitting}
                onClick={() => {
                  if (Object.keys(errors).length > 0) {
                    toast.error(
                      t("restaurantForm.validation.someFieldsMissing")
                    );
                  }
                }}
                className="bg-teal-500-300 px-4 py-1 rounded-lg shadoow w-40"
                type="submit"
                size="sm"
              >
                {t("button.submit")}
              </Button>
            </div>
          </>
        )}
      </Form>

      {/* Main Photos Modal */}
      {type === "update" && currentRestaurant && (
        <MainPhotosModal
          isOpen={showMainPhotosModal}
          onClose={() => setShowMainPhotosModal(false)}
          restaurant={currentRestaurant}
          onUpdate={handleMainPhotosUpdate}
        />
      )}
    </>
  );
};
