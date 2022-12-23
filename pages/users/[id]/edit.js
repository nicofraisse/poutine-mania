import * as Yup from "yup";
import toast from "react-hot-toast";
import Form from "components/Form";
import Field from "components/Field";
import Button from "components/Button";
import axios from "axios";
import { useCurrentUser } from "lib/useCurrentUser";
import { capitalize } from "lodash";
import { ChevronLeft, Info } from "react-feather";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";
import { max } from "date-fns";
import ImageUpload from "../../../components/controls/ImageUpload";

const Edit = () => {
  const { push, back, query } = useRouter();
  const { currentUser } = useCurrentUser();
  console.log({ currentUser });

  const handleChangePassword = (values, formikBag) => {
    axios
      .patch("/api/users/change-password", values)
      .then((data) => {
        toast.success("Mot de passe mis à jour avec succès!");
        formikBag.setSubmitting(false);
      })
      .catch((e) => {
        toast.error(
          e?.response?.data?.message ||
            "Une erreur est survenue. Veuillez réessayer"
        );
        formikBag.setSubmitting(false);
      });
  };
  const handleUpdateInfo = async (values, formikBag) => {
    const publicId = await uploadToCloudinary(values.avatar);

    axios
      .patch(`/api/users/${query.id}/update`, {
        ...values,
        ...(publicId !== "skip" && { image: publicId }),
      })
      .then((data) => {
        toast.success("Informations mises à jour avec succès!");
        formikBag.setSubmitting(false);
      })
      .catch((e) => {
        toast.error(
          e?.response?.data?.message ||
            "Une erreur est survenue. Veuillez réessayer"
        );
        formikBag.setSubmitting(false);
      });
  };
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Êtes-vous sûr(e) de vouloir supprimer votre compte ainsi que toutes les données qui lui sont associées? Cette action est irréversible."
      )
    ) {
      axios
        .post(`/api/users/${query.id}/soft-delete`)
        .then((data) => {
          toast.success("Votre compte a été supprimé avec succès!");
          setTimeout(() => {
            signOut();
            push("/");
          }, 4000);
        })
        .catch(() => toast.error("Une erreur est survenue."));
    }
  };
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

  if (!currentUser) return null;

  let providerName;
  const isCredentialAccount = currentUser.connectedAccounts?.length === 0;
  if (!isCredentialAccount) {
    providerName = capitalize(currentUser.connectedAccounts[0].providerId);
  }

  return (
    <div className="max-w-[400px] ml-8 pt-5">
      <Button
        size="sm"
        variant="lightLink"
        height="sm"
        className="-ml-1 mb-3"
        onClick={() => push(`/users/${currentUser._id}`)}
      >
        <ChevronLeft />
        Retour à mon profil
      </Button>
      <div className={"p-4 border rounded-lg my-4"}>
        <h2 className="font-bold text-2xl text-center my-4">
          Modifier mes informations
        </h2>
        <Form
          initialValues={{
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            avatar: currentUser.image,
          }}
          onSubmit={handleUpdateInfo}
          validationSchema={Yup.object({
            firstName: Yup.string().min(1).max(20).required("Requis"),
            lastName: Yup.string().min(1).max(20),
            avatar: Yup.object().nullable(),
          })}
          className="max-w-sm p-4"
        >
          {({ isSubmitting }) => (
            <>
              {isCredentialAccount && (
                <>
                  <Field name="firstName" label="Prénom" />
                  <Field name="lastName" label="Nom" />
                </>
              )}
              <Field name="avatar" control={ImageUpload} roundedFull />

              <Button
                type="submit"
                variant="primary"
                className="mt-6 w-full"
                loading={isSubmitting}
              >
                Enregistrer
              </Button>
            </>
          )}
        </Form>
      </div>
      {isCredentialAccount ? (
        <div className={"p-4 border rounded-lg my-4"}>
          <h2 className="font-bold text-2xl text-center my-4">
            Changer mon mot de passe
          </h2>
          <Form
            initialValues={{ oldPassword: "", newPassword: "" }}
            onSubmit={handleChangePassword}
            validationSchema={Yup.object({
              oldPassword: Yup.string().min(1).required("Required"),
              newPassword: Yup.string().min(1).required("Required"),
            })}
            className="max-w-sm p-4"
          >
            {({ isSubmitting }) => (
              <>
                <Field
                  name="oldPassword"
                  type="password"
                  label="Ancien mot de passe"
                />
                <Field
                  name="newPassword"
                  type="password"
                  label="Nouveau mot de passe"
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="mt-6 w-full"
                  loading={isSubmitting}
                >
                  Enregistrer
                </Button>
              </>
            )}
          </Form>
        </div>
      ) : (
        <div className="p-3 border rounded-lg">
          <Info className="inline mr-2" size={20} />
          Votre compte est lié à votre profil{" "}
          <span className="font-bold">{providerName}</span> dont le courriel
          associé est {currentUser.email}.
          <div className="mt-3">
            Pour modifier votre nom, prénom, ou courriel, vous devez faire les
            changements directement sur votre compte {providerName}.
          </div>
        </div>
      )}

      <button
        className="border rounded-lg my-4 hover:bg-red-100 font-bold text-red-500 text-center p-4 w-full"
        onClick={handleDeleteAccount}
      >
        Supprimer mon compte
      </button>
    </div>
  );
};

export default Edit;
