import axios from "axios";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Form from "components/Form";
import Field from "components/Field";
import Button from "components/Button";
import { useLoginForm } from "../context/LoginFormProvider";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const SignUp = ({ onSubmit }) => {
  const { openLogin, closeSignup } = useLoginForm();
  const [isEmbeddedBrowser, setIsEmbeddedBrowser] = useState();
  const [showEmbeddedBrowserError, setShowEmbeddedBrowserError] =
    useState(false);
  const { t } = useTranslation();
  const { locale } = useRouter();

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setIsEmbeddedBrowser(isEmbeddedBrowserFunc(userAgent));
  }, []);

  const isEmbeddedBrowserFunc = (userAgent) => {
    const embeddedIdentifiers = [
      "Instagram",
      "LinkedIn",
      "FBA[NV]",
      "Twitter",
      "WhatsApp",
      "Snapchat",
      "Pinterest",
      "WeChat",
      "Line",
      "Slack",
    ];

    for (const identifier of embeddedIdentifiers) {
      const regex = new RegExp(identifier, "i");
      if (regex.test(userAgent)) {
        return true;
      }
    }

    return false;
  };

  const handleSubmit = (values, formikBag) => {
    axios
      .post("/api/auth/signup", { ...values, locale })
      .then(() => {
        onSubmit(values.email);
      })
      .catch((e) => {
        toast.error(
          e?.response?.data?.messageKey
            ? t(e?.response?.data?.messageKey)
            : e?.response?.data?.message || e.message
        );
        formikBag.setSubmitting(false);
      });
  };

  const handleSwitchForm = () => {
    closeSignup();
    openLogin();
  };

  const handleGoogleSignin = () => {
    if (isEmbeddedBrowser) {
      setShowEmbeddedBrowserError(true);
      return;
    }
    signIn("google");
  };

  const openTermsPopup = (e) => {
    e.preventDefault();
    const url =
      locale === "fr" ? "/conditions-generales" : "/terms-and-conditions";
    window.open(
      url,
      "termsPopup",
      "width=600,height=700,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes"
    );
  };

  return (
    <Form
      initialValues={{ name: "", email: "", password: "" }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object({
        name: Yup.string().min(1).required(t("signup.required")),
        email: Yup.string().min(1).required(t("signup.required")),
        password: Yup.string().min(1).required(t("signup.required")),
      })}
      className="mx-auto w-[320px] sm:w-[380px] p-4"
    >
      {({ isSubmitting }) => (
        <>
          <Button
            type="button"
            variant="white"
            className="w-full mb-4"
            onClick={handleGoogleSignin}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 48 48"
              width="32px"
              height="32px"
              className="mr-3"
            >
              <defs>
                <path
                  id="a"
                  d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                />
              </defs>
              <clipPath id="b">
                <use xlinkHref="#a" overflow="visible" />
              </clipPath>
              <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
              <path
                clipPath="url(#b)"
                fill="#EA4335"
                d="M0 11l17 13 7-6.1L48 14V0H0z"
              />
              <path
                clipPath="url(#b)"
                fill="#34A853"
                d="M0 37l30-23 7.9 1L48 0v48H0z"
              />
              <path
                clipPath="url(#b)"
                fill="#4285F4"
                d="M48 48L17 24l-4-3 35-10z"
              />
            </svg>
            {t("signup.continueWithGoogle")}
          </Button>

          {showEmbeddedBrowserError && (
            <div className="text-xs text-red-500">
              {t("signup.embeddedBrowserError")}
            </div>
          )}

          <div className="w-full flex items-center justify-between my-6">
            <div className="grow bg-gray-300 h-[1px]"></div>
            <div className="text-gray-500 px-3 text-sm">{t("signup.or")}</div>
            <div className="grow bg-gray-300 h-[1px]"></div>
          </div>

          <Field
            name="name"
            label={t("signup.usernameLabel")}
            placeholder={t("signup.usernamePlaceholder")}
          />
          <Field name="email" label={t("signup.emailLabel")} />
          <Field
            name="password"
            type="password"
            label={t("signup.passwordLabel")}
          />

          <div className="text-sm">
            {t("signup.haveAccountPart1")}&nbsp;
            <span
              className="font-black cursor-pointer underline text-teal-700 hover:text-teal-600"
              onClick={handleSwitchForm}
            >
              {t("signup.login")}
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="mt-6 w-full"
            loading={isSubmitting}
          >
            {t("signup.signupButton")}
          </Button>

          <div className="text-xs text-slate-500 text-center mt-6">
            {t("signup.termsPart1")}
            <a
              href={
                locale === "fr"
                  ? "/conditions-generales"
                  : "/terms-and-conditions"
              }
              onClick={openTermsPopup}
              className="text-teal-600 hover:text-teal-700 font-bold"
            >
              {t("signup.termsLink")}
            </a>
            .
          </div>
        </>
      )}
    </Form>
  );
};

export default SignUp;
