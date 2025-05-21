import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Spinner } from "../components/Spinner";
import Button from "../components/Button";
import { useLoginForm } from "../components/context/LoginFormProvider";
import { useTranslation } from "next-i18next";
import { withI18n } from "../lib/withI18n";

const VerifyEmail = () => {
  const [verificationState, setVerificationState] = useState();
  const [showResend, setShowResend] = useState(true);
  const [sending, setSending] = useState(false);
  const { openLogin } = useLoginForm();
  const { query, locale } = useRouter();
  const token = query?.token;
  const email = query?.email;
  const { t } = useTranslation();

  useEffect(() => {
    if (token) {
      handleVerifyEmail();
    }
  }, [token]);

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

  const texts = {
    success: {
      header: t("verifyEmail.successResponse.header"),
      paragraph: t("verifyEmail.successResponse.paragraph"),
      cta: (
        <Button
          variant="primary"
          height="sm"
          width="sm"
          onClick={() => openLogin({ redirect: "/" })}
        >
          {t("verifyEmail.successResponse.cta")}
        </Button>
      ),
    },
    fail: {
      header: t("verifyEmail.failResponse.header"),
      paragraph: t("verifyEmail.failResponse.paragraph"),
      cta: showResend ? (
        <Button
          onClick={resendVerificationEmail}
          variant="primary"
          loading={sending}
          height="sm"
          width="sm"
        >
          {t("verifyEmail.failResponse.cta")}
        </Button>
      ) : (
        t("verifyEmail.failResponse.sent")
      ),
    },
  };

  const handleVerifyEmail = async () => {
    try {
      await axios.post("/api/auth/verify-email", { token, locale });
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

export const getStaticProps = withI18n();
export default VerifyEmail;
