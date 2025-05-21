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
import { Plus, Trash } from "react-feather";
import { cloneDeep, isString } from "lodash";
import classNames from "classnames";
import PillSelect from "../controls/PillSelect";
import PhoneInput from "components/controls/PhoneInput";
import { useCurrentUser } from "../../lib/useCurrentUser";
import { useRestaurantPriceOptions } from "../../lib/useRestaurantPrices";
import { useTranslation } from "next-i18next";

export const RestaurantForm = ({ type }) => {
  const { query, push } = useRouter();
  const { currentUser } = useCurrentUser();
  const priceOptions = useRestaurantPriceOptions();
  const { t } = useTranslation();

  const [succursales, setSuccursales] = useState([
    { address: "", phoneNumber: "" },
  ]);

  const { data: restaurant, loading } = useGet(`/api/restaurants/${query.id}`, {
    skip: !query.id,
  });

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

          push(
            currentUser.isAdmin
              ? "/admin/restaurants"
              : `/restaurants/${data.restaurant.slug}`
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
              : `/restaurants/${restaurant.slug}`
          );
        })
        .catch((err) => toast.error(err.response.data.error ?? err.message))
        .finally(() => setSubmitting(false));
    }
  };

  useEffect(() => {
    if (restaurant?.succursales && succursales[0].address === "") {
      setSuccursales(restaurant.succursales);
    }
  }, [restaurant, succursales]);

  const updateSuccursaleField = (value, index, field) => {
    const succursalesCopy = cloneDeep(succursales);
    succursalesCopy[index][field] = value;
    setSuccursales(succursalesCopy);
  };

  if (loading || (type === "update" && !restaurant)) return <Spinner />;

  const initialValues = {
    name: type === "update" ? restaurant.name : "",
    website: type === "update" ? restaurant.website : "",
    priceRange: type === "update" ? restaurant.priceRange : null,
    categories: type === "update" ? restaurant.categories : [],
    "address-0": null,
    "phoneNumber-0": "",
  };

  if (type === "update") {
    restaurant.succursales.forEach((succursale, index) => {
      initialValues[`address-${index}`] = {
        label: succursale.address.place_name,
        value: succursale.address,
      };
      initialValues[`phoneNumber-${index}`] = succursale.phoneNumber;
    });
  }

  //  "validation": {
  //   "address": "Veuillez indiquer l'adresse de ce restaurant",
  //   "categories": "Vous devez ajouter au moins 1 catégorie",
  //   "name": {
  //     "max": "Le nom doit faire au plus 50 caractères",
  //     "min": "Le nom doit faire au moins 1 caractère",
  //     "required": "Requis"
  //   },
  //   "website": {
  //     "url": "Veuillez entrer une URL valide"
  //   }
  // }

  return (
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
        priceRange: Yup.number().nullable().required(t("validation.required")),
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
          <Field name="website" label={t("restaurantForm.websiteLabel")} />
          <div className="flex items-center justify-between">
            <Button
              loading={isSubmitting}
              onClick={() => {
                if (Object.keys(errors).length > 0) {
                  toast.error(t("restaurantForm.validation.someFieldsMissing"));
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
  );
};
