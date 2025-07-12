import { createContext, useContext, useState } from "react";
import { X } from "react-feather";
import Modal from "react-responsive-modal";

import Login from "../forms/Login";
import SignUp from "../forms/SignUp";
import { EmailConfirmation } from "../EmailConfirmation";
import { useTranslation } from "next-i18next";

const LoginFormContext = createContext({});

export const LoginFormProvider = ({ children }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [emailToConfirm, setEmailToConfirm] = useState(null);
  const { t } = useTranslation();

  const toggleLogin = (open, options) => {
    setLoginOpen(open);
    if (options?.message) {
      setTimeout(() => {
        setLoginMessage(options.message);
      }, [!open ? 500 : 0]);
    }
    if (options?.redirect) {
      setRedirectUrl(options.redirect);
    }
  };

  const toggleSignup = (open, redirect = "") => {
    setSignupOpen(open);
    setRedirectUrl(redirect);
  };

  const handleShowConfirmation = (email) => {
    setEmailToConfirm(email);
  };

  return (
    <LoginFormContext.Provider
      value={{
        openLogin: ({ message, redirect } = {}) =>
          toggleLogin(true, { message, redirect }),
        openSignup: (redirect) => toggleSignup(true, redirect),
        closeLogin: () => toggleLogin(false),
        closeSignup: () => toggleSignup(false),
      }}
    >
      {children}
      <Modal
        classNames={{ overlay: "customOverlay", modal: "rateModal" }}
        open={loginOpen}
        onClose={() => toggleLogin(false)}
        closeIcon={<X />}
        blockScroll={false}
        center
      >
        <div className="flex flex-col items-center">
          {loginMessage || (
            <h2 className="font-black text-3xl text-center pb-3">
              {t("login.title")}
            </h2>
          )}
          <Login
            onSubmit={() => toggleLogin(false)}
            redirect={redirectUrl}
            setEmailToConfirm={(email) => {
              setEmailToConfirm(email);
              toggleLogin(false);
              toggleSignup(true);
            }}
          />
        </div>
      </Modal>
      <Modal
        classNames={{ overlay: "customOverlay", modal: "customModal" }}
        open={signupOpen}
        onClose={() => {
          toggleSignup(false);
          setTimeout(() => setEmailToConfirm(null), 500);
        }}
        closeIcon={<X />}
        blockScroll={false}
        center
      >
        {emailToConfirm ? (
          <EmailConfirmation email={emailToConfirm} />
        ) : (
          <>
            <h2 className="font-black text-3xl text-center pb-3 pt-5">
              {t("signup.title")}
            </h2>
            <SignUp onSubmit={handleShowConfirmation} redirect={redirectUrl} />
          </>
        )}
      </Modal>
    </LoginFormContext.Provider>
  );
};

export const useLoginForm = () => useContext(LoginFormContext);

export default LoginFormContext;
