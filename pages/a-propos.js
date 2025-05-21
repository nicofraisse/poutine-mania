import React from "react";
import { Mail } from "react-feather";
import Button from "../components/Button";
import Head from "next/head";
import { Trans, useTranslation } from "next-i18next";
import { withI18n } from "../lib/withI18n";

const APropos = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <title>{t("about.title")}</title>
        <meta name="description" content={t("about.metaDescription")} />
      </Head>
      <div className="text-center sm:flex justify-center items-center min-h-screen-minus-navbar">
        <div>
          <h1 className="sm:-mt-5 mb-6 sm:mb-10 pt-4 sm:pt-0 font-black text-3xl sm:text-4xl">
            {t("about.heading")}
          </h1>
          <div className="max-w-2xl mx-auto bg-white py-5 px-6 -sm border rounded-md text-sm sm:text-md">
            <p className="text-left mb-4">{t("about.intro1")}</p>
            <p className="text-left mb-4">{t("about.intro2")}</p>
            <p className="text-left">
              <Trans
                i18nKey="about.intro3"
                components={[
                  <strong key="0" />,
                  <strong key="1" />,
                  <strong key="2" />,
                ]}
              />
            </p>
            <a href="mailto:cyys100@gmail.com">
              <Button
                variant="white"
                className="mt-4 mb-1 w-[128px] mx-auto max-h-[56px]"
              >
                <Mail className="mr-2" />
                {t("about.contactButton")}
              </Button>
            </a>
          </div>
          <div className="mb-4 sm:mt-12 mt-8">
            {t("about.footer", { year: currentYear })}
          </div>
        </div>
      </div>
    </>
  );
};

export default APropos;

export const getStaticProps = withI18n();
