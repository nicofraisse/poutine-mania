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
import { signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import ImageUpload from "components/controls/ImageUpload";
import { useTranslation } from "next-i18next";
import { withI18n } from "lib/withI18n";

const Edit = () => {
  const { t } = useTranslation();
  const { push, query } = useRouter();
  const { currentUser } = useCurrentUser();

  const handleChangePassword = (values, formikBag) => {
    axios
      .patch("/api/users/change-password", values)
      .then(() => {
        toast.success(t("userProfile.edit.toast.passwordSuccess"));
        formikBag.setSubmitting(false);
      })
      .catch(() => {
        toast.error(t("userProfile.edit.toast.error"));
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(t("userProfile.edit.toast.updateInfoSuccess"));
      formikBag.setSubmitting(false);
      const updatedSession = await getSession({ force: true });
      updatedSession.user.image = response.data.image;
      refetchCurrentUser();
      push(`/profil/${query.id}`);
    } catch {
      toast.error(t("userProfile.edit.toast.error"));
      formikBag.setSubmitting(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t("userProfile.edit.confirmDelete"))) {
      axios
        .post(`/api/users/${currentUser._id}/soft-delete`)
        .then(() => {
          toast.success(t("userProfile.edit.toast.deleteSuccess"));
          setTimeout(() => {
            signOut();
            push("/");
          }, 4000);
        })
        .catch(() => toast.error(t("userProfile.edit.toast.deleteError")));
    }
  };

  if (!currentUser) return null;

  const isCredentialAccount = currentUser.connectedAccounts?.length === 0;
  const providerName = !isCredentialAccount
    ? capitalize(currentUser.connectedAccounts[0].providerId)
    : null;

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
        {t("userProfile.edit.backToProfile")}
      </Button>

      <div className="p-2 sm:p-4 border rounded my-4 bg-white">
        <h2 className="font-bold text-xl sm:text-2xl text-center my-4">
          {t("userProfile.edit.editInfoHeading")}
        </h2>
        <Form
          initialValues={{
            name: currentUser.name,
            bio: currentUser.bio,
            avatar: currentUser.image,
          }}
          onSubmit={handleUpdateInfo}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(1)
              .max(20)
              .required(t("userProfile.edit.required")),
            bio: Yup.string().min(0).max(300),
            avatar: Yup.object().nullable(),
          })}
          className="max-w-sm p-4"
        >
          {({ isSubmitting }) => (
            <>
              <Field name="name" label={t("userProfile.edit.username")} />

              <Field
                name="bio"
                type="textarea"
                label={t("userProfile.edit.bio")}
              />
              <Field name="avatar" control={ImageUpload} roundedFull />
              <Button
                type="submit"
                variant="primary"
                className="mt-6 w-full"
                loading={isSubmitting}
              >
                {t("userProfile.edit.save")}
              </Button>
            </>
          )}
        </Form>
      </div>

      {isCredentialAccount ? (
        <div className="p-4 border rounded my-4 bg-white">
          <h2 className="font-bold text-2xl text-center my-4">
            {t("userProfile.edit.changePasswordHeading")}
          </h2>
          <Form
            initialValues={{ oldPassword: "", newPassword: "" }}
            onSubmit={handleChangePassword}
            validationSchema={Yup.object({
              oldPassword: Yup.string()
                .min(1)
                .required(t("userProfile.edit.required")),
              newPassword: Yup.string()
                .min(1)
                .required(t("userProfile.edit.required")),
            })}
            className="max-w-sm p-4"
          >
            {({ isSubmitting }) => (
              <>
                <Field
                  name="oldPassword"
                  type="password"
                  label={t("userProfile.edit.oldPassword")}
                />
                <Field
                  name="newPassword"
                  type="password"
                  label={t("userProfile.edit.newPassword")}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="mt-6 w-full"
                  loading={isSubmitting}
                >
                  {t("userProfile.edit.save")}
                </Button>
              </>
            )}
          </Form>
        </div>
      ) : (
        <div className="p-4 border bg-white rounded text-slate-500 text-sm">
          <Info className="inline mr-2" size={20} />
          {t("userProfile.edit.linkedAccountInfo", {
            provider: providerName,
            email: currentUser.email,
          })}
        </div>
      )}

      <button
        className="border rounded-lg my-4 hover:bg-red-100 font-bold text-red-500 text-center p-4 w-full"
        onClick={handleDeleteAccount}
      >
        {t("userProfile.edit.deleteAccount")}
      </button>
    </div>
  );
};

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
export const getStaticProps = withI18n();

export default Edit;
