// pages/verify-email.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import { useLoginForm } from "../components/context/LoginFormProvider";

const VerifyEmail = () => {
  const [verificationState, setVerificationState] = useState();
  const [showResend, setShowResend] = useState(true);
  const [sending, setSending] = useState(false);
  const { openLogin } = useLoginForm();
  const { query } = useRouter();
  const token = query?.token;
  const email = query?.email;

  useEffect(() => {
    if (token) {
      handleVerifyEmail();
    }
  }, [token]);

  const sendEmailPromise = useCallback(() => {
    return new Promise((resolve, reject) => {
      axios
        .put("/api/auth/send-verification-email", { email })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }, [email]);

  const resendVerificationEmail = useCallback(async () => {
    setSending(true);

    await toast.promise(sendEmailPromise(), {
      loading: <b>Envoi...</b>,
      success: <b>Courriel envoyé!</b>,
      error: (e) => <b>Une erreur s&apos;est produite: {e.message}</b>,
    });

    setSending(false);
    setShowResend(false);
  }, [sendEmailPromise]);

  const texts = {
    success: {
      header: "Email vérifié avec succès!",
      paragraph:
        "Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter à votre compte.",

      cta: (
        <Button
          variant="primary"
          height="sm"
          width="sm"
          onClick={() => openLogin()}
        >
          Connexion
        </Button>
      ),
    },
    fail: {
      header: "Token invalide 😢",
      paragraph:
        "Désolé, le lien de vérification de l'email est invalide ou expiré.",
      cta: showResend ? (
        <Button
          onClick={resendVerificationEmail}
          variant="primary"
          loading={sending}
          height="sm"
          width="sm"
        >
          Renvoyer un courriel
        </Button>
      ) : (
        "Envoyé!"
      ),
    },
  };

  const handleVerifyEmail = async () => {
    try {
      await axios.post("/api/auth/verify-email", { token });
      setVerificationState("success");
    } catch (error) {
      setVerificationState("fail");
    }
  };

  if (Object.keys(texts).includes(verificationState)) {
    return (
      <div className="pt-20 text-center">
        <div className="my-auto mx-auto py-6 px-3 max-w-xs rounded-lg shadow-md bg-white border border-slate-200 text-slate-500">
          <h1 className="font-bold text-xl">
            {texts[verificationState]?.header}
          </h1>
          <p className="mt-0 mb-5">{texts[verificationState]?.paragraph}</p>
          {texts[verificationState]?.cta}
        </div>
      </div>
    );
  }

  return <Spinner />;
};

export default VerifyEmail;
