import * as Yup from "yup";
import toast from "react-hot-toast";
import Form from "components/Form";
import Field from "components/Field";
import Button from "components/Button";
import axios from "axios";
import { useCurrentUser, refetchCurrentUser } from "lib/useCurrentUser";
import { capitalize, isString } from "lodash";
import { ChevronLeft, Info } from "react-feather";
import { useRouter } from "next/router";
import { signOut, getSession } from "next-auth/client";
import ImageUpload from "../../../components/controls/ImageUpload";

const Edit = () => {
  const { push, query } = useRouter();
  const { currentUser } = useCurrentUser();

  const handleChangePassword = (values, formikBag) => {
    axios
      .patch("/api/users/change-password", values)
      .then(() => {
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
    formikBag.setSubmitting(true);
    const formData = new FormData();
    for (const key in values) {
      if (key === "avatar" && values[key] && !isString(values[key])) {
        for (const [, file] of values[key].entries()) {
          formData.append(`avatar`, file);
        }
      } else {
        formData.append(key, values[key]);
      }
    }

    try {
      const response = await axios.patch(
        `/api/users/${query.id}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Informations mises à jour avec succès!");
      formikBag.setSubmitting(false);
      const updatedSession = await getSession({ force: true });
      updatedSession.user.image = response.data.image; // Assuming the API response returns the new image URL
      refetchCurrentUser();
      push(`/profil/${query.id}`);
    } catch (e) {
      toast.error(
        e?.response?.data?.message ||
          "Une erreur est survenue. Veuillez réessayer"
      );
      formikBag.setSubmitting(false);
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Es-tu sûr(e) de vouloir supprimer ton compte ainsi que toutes les données qui lui sont associées? Cette action est irréversible."
      )
    ) {
      axios
        .post(`/api/users/${query.id}/soft-delete`)
        .then(() => {
          toast.success("Ton compte a été supprimé avec succès!");
          setTimeout(() => {
            signOut();
            push("/");
          }, 4000);
        })
        .catch(() => toast.error("Une erreur est survenue."));
    }
  };

  if (!currentUser) return null;

  let providerName;
  const isCredentialAccount = currentUser.connectedAccounts?.length === 0;
  if (!isCredentialAccount) {
    providerName = capitalize(currentUser.connectedAccounts[0].providerId);
  }

  return (
    <div className="mx-auto w-full sm:max-w-[500px] pt-5">
      <Button
        size="sm"
        variant="lightLink"
        height="sm"
        className="-ml-1"
        onClick={() => push(`/profil/${currentUser.slug}`)}
      >
        <ChevronLeft />
        Retour à mon profil
      </Button>
      <div className="p-2 sm:p-4 border rounded my-4 bg-white">
        <h2 className="font-bold text-xl sm:text-2xl text-center my-4">
          Modifier mes informations
        </h2>
        <Form
          initialValues={{
            name: currentUser.name,
            bio: currentUser.bio,
            avatar: currentUser.image,
          }}
          onSubmit={handleUpdateInfo}
          validationSchema={Yup.object({
            name: Yup.string().min(1).max(20).required("Requis"),
            bio: Yup.string().min(0).max(300),
            avatar: Yup.object().nullable(),
          })}
          className="max-w-sm p-4"
        >
          {({ isSubmitting }) => (
            <>
              <Field name="name" label="Nom d'utilisateur" />

              <Field name="bio" type="textarea" />
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
        <div className={"p-4 border rounded my-4 bg-white"}>
          <h2 className="font-bold text-2xl text-center my-4">
            Changer mon mot de passe
          </h2>
          <Form
            initialValues={{ oldPassword: "", newPassword: "" }}
            onSubmit={handleChangePassword}
            validationSchema={Yup.object({
              oldPassword: Yup.string().min(1).required("Requis"),
              newPassword: Yup.string().min(1).required("Requis"),
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
        <div className="p-4 border bg-white rounded text-slate-500 text-sm">
          <Info className="inline mr-2" size={20} />
          Ton compte est lié à ton profil{" "}
          <span className="font-bold">{providerName}</span> dont le courriel
          associé est {currentUser.email}.
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
