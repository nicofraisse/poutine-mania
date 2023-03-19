import { createContext, useContext, useState } from "react";
import { Info, Mail, X } from "react-feather";
import Modal from "react-responsive-modal";
import { BrandLogo } from "../BrandLogo";
import Button from "../Button";
import Login from "../forms/Login";
import SignUp from "../forms/SignUp";

const LoginFormContext = createContext({});

export const LoginFormProvider = ({ children }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(
    "ok@showEmailConfirmation.com"
  );

  const openLogin = (message, redirect) => {
    setLoginOpen(true);
    setLoginMessage(message || "");
    setRedirectUrl(redirect || "");
  };

  const closeLogin = () => {
    setLoginOpen(false);
  };

  const openSignup = (_, redirect) => {
    setSignupOpen(true);
    setRedirectUrl(redirect || "");
  };

  const closeSignup = () => {
    setSignupOpen(false);
  };

  const handleShowConfirmation = (v) => setShowEmailConfirmation(v);

  return (
    <LoginFormContext.Provider
      value={{ openLogin, openSignup, closeLogin, closeSignup }}
    >
      <>
        {children}
        <Modal
          classNames={{
            overlay: "customOverlay",
            modal: "rateModal",
          }}
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          closeIcon={<X />}
          center
        >
          <div className="flex flex-col items-center">
            {loginMessage || (
              <h2 className="font-black text-3xl text-center pb-3">
                Connexion
              </h2>
            )}
            <Login
              onSubmit={() => setLoginOpen(false)}
              redirect={redirectUrl}
            />
          </div>
        </Modal>
        <Modal
          classNames={{
            overlay: "customOverlay",
            modal: "customModal",
          }}
          open={signupOpen}
          onClose={() => setSignupOpen(false)}
          closeIcon={<X />}
          center
        >
          {showEmailConfirmation ? (
            <div className="sm:p-5 flex flex-col items-center justify-center max-w-2xs">
              <div className="mb-6 rounded-full w-24 h-24 border-4 border-teal-400 flex items-center justify-center">
                <Mail size={48} className="text-teal-400" />
              </div>
              <div className="bg-slate-50 border rounded border-slate-200 px-5 py-6">
                <h2 className="font-black text-2xl text-center mb-3 text-slate-500">
                  Vous y êtes presque!
                </h2>

                <div className="max-w-2xs text-md text-slate-500 text-center">
                  Veuillez consulter votre boîte de réception à l&apos;adresse
                  fournie et cliquer sur le lien de confirmation que nous venons
                  de vous envoyer.
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-black text-3xl text-center pb-3 pt-5">
                Créer mon compte
              </h2>
              <SignUp
                onSubmit={handleShowConfirmation}
                redirect={redirectUrl}
              />
            </>
          )}
        </Modal>
      </>
    </LoginFormContext.Provider>
  );
};

export const useLoginForm = () => {
  return useContext(LoginFormContext);
};

export default LoginFormContext;
