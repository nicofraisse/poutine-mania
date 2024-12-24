import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Button from "../Button";
import * as Yup from "yup";
import Form from "components/Form";
import Field from "components/Field";
import { useLoginForm } from "../context/LoginFormProvider";
import { useEffect, useState } from "react";

const Login = ({ onSubmit, redirect, setEmailToConfirm }) => {
  const { openSignup, closeLogin } = useLoginForm();

  const [isEmbeddedBrowser, setIsEmbeddedBrowser] = useState();
  const [showEmbeddedBrrowserError, setShowEmbeddedBrrowserError] =
    useState(false);

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

  const options = {
    redirect: false,
    callbackUrl: redirect
      ? window.location.origin + redirect
      : window.location.href,
  };

  const handleSubmit = (values, formikBag) => {
    signIn("credentials", {
      ...values,
      ...options,
    })
      .then((data) => {
        if (data.error) {
          const error = JSON.parse(data.error);

          if (error?.code === "EMAIL_NOT_VALIDATED") {
            setEmailToConfirm(values.email);
          } else {
            toast.error(error?.message);
          }
        } else {
          toast.success("Vous êtes maintenant connecté(e).");
          onSubmit && onSubmit();
        }
        formikBag.setSubmitting(false);
      })
      .catch((e) => {
        const error = JSON.parse(e.message);
        toast.error(error);
        formikBag.setSubmitting(false);
      });
  };

  const handleSwitchForm = () => {
    closeLogin();
    openSignup();
  };

  const handleGoogleSignin = () => {
    if (isEmbeddedBrowser) {
      setShowEmbeddedBrrowserError(true);
      return;
    }
    signIn("google", options);
  };

  return (
    <Form
      initialValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object({
        email: Yup.string().min(1).required("Requis"),
        password: Yup.string().min(1).required("Requis"),
      })}
      className="sm:w-[380px] p-4"
    >
      {({ isSubmitting }) => (
        <>
          <Button
            type="button"
            variant="white"
            className="w-full mb-4"
            onClick={() => handleGoogleSignin()}
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
            Continuer avec Google
          </Button>
          {showEmbeddedBrrowserError && (
            <div className="text-xs text-red-500">
              Pour vous connecter avec Google, vous devez ouvrir cette page dans
              le navigateur de votre smartphone (Safari ou Chrome).
            </div>
          )}
          {/* <Button
            type="button"
            variant={VariantColor.blue}
            className="px-5 w-full text-white"
            onClick={() => signInNewWindow("facebook", options, false)}
          >
            <svg
              width="32px"
              height="32px"
              viewBox="0 0 512 512"
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              className="mr-3"
            >
              <path d="M480,257.35c0-123.7-100.3-224-224-224s-224,100.3-224,224c0,111.8,81.9,204.47,189,221.29V322.12H164.11V257.35H221V208c0-56.13,33.45-87.16,84.61-87.16,24.51,0,50.15,4.38,50.15,4.38v55.13H327.5c-27.81,0-36.51,17.26-36.51,35v42h62.12l-9.92,64.77H291V478.66C398.1,461.85,480,369.18,480,257.35Z" />
            </svg>
            Continuer avec Facebook
          </Button> */}
          <div className="w-full flex items-center justify-between my-6">
            <div className="grow bg-gray-300 h-[1px]"></div>
            <div className="text-gray-500 px-3 text-sm">OU</div>
            <div className="grow bg-gray-300 h-[1px]"></div>
          </div>
          <Field name="email" label="Adress courriel" />
          <Field name="password" type="password" label="Mot de passe" />
          <div className="text-sm">
            Vous n&apos;avez pas de compte?{" "}
            <span
              className="font-bold cursor-pointer hover:underline"
              onClick={handleSwitchForm}
            >
              Inscription
            </span>
          </div>
          <Button
            type="submit"
            variant="primary"
            className="mt-6 w-full"
            loading={isSubmitting}
          >
            Connexion
          </Button>
        </>
      )}
    </Form>
  );
};

export default Login;
