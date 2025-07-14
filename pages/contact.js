import React, { useState } from "react";
import { Send } from "react-feather";
import Button from "../components/Button";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { withI18n } from "../lib/withI18n";
import * as Yup from "yup";
import Form from "components/Form";
import Field from "components/Field";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const Contact = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string(),
    email: Yup.string().email(t("contact.validation.emailFormat")),
    message: Yup.string()
      .min(10, t("contact.validation.messageMinLength"))
      .required(t("contact.validation.messageRequired")),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userEmail: session?.user?.email,
          userId: session?.user?._id,
        }),
      });

      if (response.ok) {
        toast.success(t("contact.form.successTitle"));
        setIsSubmitted(true);
        resetForm();
      } else {
        toast.error(t("contact.form.errorMessage"));
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(t("contact.form.errorMessage"));
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Head>
          <title>{t("contact.title")}</title>
          <meta name="description" content={t("contact.metaDescription")} />
        </Head>
        <div className="text-center sm:flex justify-center items-center min-h-screen-minus-navbar">
          <div>
            <h1 className="sm:-mt-5 mb-6 sm:mb-10 pt-4 sm:pt-0 font-black text-3xl sm:text-4xl text-green-600">
              {t("contact.form.successTitle")}
            </h1>
            <div className="max-w-2xl mx-auto bg-white py-8 px-6 border rounded-md">
              <p className="text-center mb-4">
                {t("contact.form.successMessage")}
              </p>
              <Button
                variant="primary"
                className="mx-auto"
                onClick={() => setIsSubmitted(false)}
              >
                {t("contact.form.submitButton")}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{t("contact.title")}</title>
        <meta name="description" content={t("contact.metaDescription")} />
      </Head>
      <div className="text-center sm:flex justify-center items-center min-h-screen-minus-navbar">
        <div>
          <h1 className="sm:-mt-5 mb-6 sm:mb-10 pt-4 sm:pt-0 font-black text-3xl sm:text-4xl">
            {t("contact.heading")}
          </h1>
          <div className="max-w-2xl mx-auto bg-white py-8 px-6 border rounded-md">
            <Form
              initialValues={{
                name: session?.user?.username || "",
                email: "",
                message: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
              className="text-left"
            >
              {({ isSubmitting }) => (
                <>
                  <Field name="name" label={t("contact.form.nameLabel")} />
                  <Field
                    name="email"
                    type="email"
                    label={t("contact.form.emailLabel")}
                  />
                  <Field
                    name="message"
                    type="textarea"
                    label={t("contact.form.messageLabel")}
                    placeholder={t("contact.form.messagePlaceholder")}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="mt-4 w-full"
                    loading={isSubmitting}
                  >
                    <Send className="mr-2" size={18} />
                    {t("contact.form.submitButton")}
                  </Button>
                </>
              )}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

export const getStaticProps = withI18n();
