import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { Mail } from "react-feather";
import { toast } from "react-hot-toast";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const EmailConfirmation = ({ email }) => {
  const [showResend, setShowResend] = useState(true);
  const [sending, setSending] = useState(false);
  const { t } = useTranslation();
  const { locale } = useRouter();

  const sendEmailPromise = useCallback(() => {
    return new Promise((resolve, reject) => {
      axios
        .put("/api/auth/send-verification-email", { email, locale })
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
      loading: <b>{t("verifyEmail.toast.loading")}</b>,
      success: <b>{t("verifyEmail.toast.success")}</b>,
      error: (e) => (
        <b>
          {t("verifyEmail.toast.error")}
          {e.messageKey ? t(e.messageKey) : e.message}
        </b>
      ),
    });

    setSending(false);
    setShowResend(false);
  }, [sendEmailPromise]);

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, [email]);

  return (
    <div className="sm:p-5 flex flex-col items-center justify-center max-w-2xs">
      <div className="mb-6 rounded-full w-24 h-24 border-4 border-teal-400 flex items-center justify-center">
        <Mail size={48} className="text-teal-400" />
      </div>
      <div className="bg-slate-50 border rounded border-slate-200 px-5 py-6">
        <h2 className="font-black text-2xl text-center mb-3 text-slate-500">
          {t("verifyEmail.emailConfirmation.header")}
        </h2>

        <div className="max-w-2xs text-md text-slate-500 text-center">
          {t("verifyEmail.emailConfirmation.description")}{" "}
          {JSON.stringify(email)}
          <br />
        </div>
      </div>

      <div className="text-xs mt-6 text-slate-500 text-center">
        {showResend ? (
          <>
            {t("verifyEmail.emailConfirmation.resendPart1")}
            <button
              className="underline focus:outline-none"
              onClick={resendVerificationEmail}
              disabled={sending && !showResend}
            >
              {t("verifyEmail.emailConfirmation.resendPart2")}
            </button>{" "}
            {t("verifyEmail.emailConfirmation.resendPart3")}
          </>
        ) : (
          <>{t("verifyEmail.emailConfirmation.resendSuccess")}</>
        )}
      </div>
    </div>
  );
};
