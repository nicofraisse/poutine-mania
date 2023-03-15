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
import Spinner from "../Spinner";
import { Plus, Trash } from "react-feather";
import { cloneDeep, isString } from "lodash";
import classNames from "classnames";
import PillSelect from "../controls/PillSelect";
import PhoneInput from "components/controls/PhoneInput";
import { useCurrentUser } from "../../lib/useCurrentUser";

const RestaurantForm = ({ type }) => {
  const { query, push } = useRouter();
  const { currentUser } = useCurrentUser();

  const [succursales, setSuccursales] = useState([
    { address: "", phoneNumber: "" },
  ]);

  const { data: restaurant, loading } = useGet(`/api/restaurants/${query.id}`, {
    skip: !query.id,
  });

  console.log(restaurant);

  const handleSubmit = (values, { setSubmitting }) => {
    console.log({ values });
    if (succursales.find((s) => !s.address && !s.hide)) {
      setSubmitting(false);
      window.alert("Adresse vide!");
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

    console.log({ submitValues });

    if (type === "create") {
      axios
        .post("/api/restaurants/create", submitValues)
        .then(() => {
          setSubmitting(false);
          toast.success("Succès");

          push(
            currentUser.isAdmin
              ? "/admin/restaurants"
              : `/restaurants/${restaurant._id}`
          );
        })
        .catch((err) => toast.error(err.message));
    } else if (type === "update") {
      axios
        .post(`/api/restaurants/${query.id}/update`, submitValues)
        .then(() => {
          toast.success("Succès");
          setSubmitting(false);

          push(
            currentUser.isAdmin
              ? `/restaurants/${restaurant._id}/edit`
              : `/restaurants/${restaurant._id}`
          );
        })
        .catch((err) => toast.error(err.message));
    }
  };

  useEffect(() => {
    if (restaurant?.succursales && succursales[0].address === "") {
      setSuccursales(restaurant.succursales);
    }
  }, [restaurant, succursales]);

  const updateSuccursaleField = (value, index, field) => {
    console.log({ value, index, field });
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

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={Yup.object({
        name: Yup.string()
          .min(1)
          .max(50, "Le nom doit faire au plus 50 caractères")
          .required("Requis"),
        categories: Yup.array()
          .min(1, "Vous devez ajouter au moins 1 catégorie")
          .required(),
        website: Yup.string().min(1),
        "address-0": Yup.object()
          .typeError("Veuillez indiquer l'addresse de ce restaurant")
          .required(),
        "phoneNumber-0": Yup.string().optional(),
        priceRange: Yup.number().nullable().required("Requis"),
      })}
    >
      {({ isSubmitting, values, errors, setFieldValue }) => (
        <>
          <Field name="name" label="Nom du restaurant" />
          <Field
            name="categories"
            control={CategorySelect}
            label="Catégorie(s)"
          />
          <Field
            name="priceRange"
            label="Prix de la poutine régulière"
            control={PillSelect}
            options={[
              { label: "Moins de 7$", value: 1 },
              { label: "Entre 7$ et 9$", value: 2 },
              { label: "Plus de 9$", value: 3 },
            ]}
            value={values.priceRange}
          />

          <div className="bg-gray-50 border p-3 sm:p-4 rounded mb-4">
            <label className="font-bold mb-2 text-sm block">Succursales</label>
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
                  label="Adresse"
                />
                <Field
                  name={`phoneNumber-${index}`}
                  label="Numéro de téléphone"
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
              Ajouter une succursale
            </Button>
          </div>
          <Field name="website" label="Site internet" />
          <div className="flex items-center justify-between">
            <Button
              loading={isSubmitting}
              onClick={() => {
                if (Object.keys(errors).length > 0)
                  toast.error(
                    "Veuillez remplir tous les champs correctement (voir les erreurs plus haut)"
                  );
              }}
              className="bg-teal-500-300 px-4 py-1 rounded-lg shadoow w-40"
              type="submit"
              size="sm"
            >
              Valider
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default RestaurantForm;
