import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { Mail } from "react-feather";
import { toast } from "react-hot-toast";

export const EmailConfirmation = ({ email }) => {
  const [showResend, setShowResend] = useState(true);
  const [sending, setSending] = useState(false);

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

  useEffect(() => {
    // Unsubscribe the old sendEmailPromise and create a new one when email changes
    return () => {
      toast.dismiss(); // Dismiss any existing toast messages
    };
  }, [email]);

  return (
    <div className="sm:p-5 flex flex-col items-center justify-center max-w-2xs">
      <div className="mb-6 rounded-full w-24 h-24 border-4 border-teal-400 flex items-center justify-center">
        <Mail size={48} className="text-teal-400" />
      </div>
      <div className="bg-slate-50 border rounded border-slate-200 px-5 py-6">
        <h2 className="font-black text-2xl text-center mb-3 text-slate-500">
          Vous y êtes presque!
        </h2>

        <div className="max-w-2xs text-md text-slate-500 text-center">
          Pour activer votre compte, cliquez sur le lien de confirmation dans le
          courriel que nous venons de vous envoyer à l&apos;adresse fournie:{" "}
          {JSON.stringify(email)}
          <br />
        </div>
      </div>

      <div className="text-xs mt-6 text-slate-500 text-center">
        {showResend ? (
          <>
            Si vous n&apos;avez pas reçu notre courriel de validation, veuillez
            vérifier votre dossier de courrier indésirable ou spam, et{" "}
            <button
              className="underline focus:outline-none"
              onClick={resendVerificationEmail}
              disabled={sending && !showResend}
            >
              cliquez ici
            </button>{" "}
            pour l&apos;envoyer de nouveau.
          </>
        ) : (
          <>Courriel envoyé!</>
        )}
      </div>
    </div>
  );
};
