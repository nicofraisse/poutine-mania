import Head from "next/head";
import { useTranslation } from "next-i18next";
import { withI18n } from "../../lib/withI18n";

const QuebecCityRanking = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("ranking.quebecCity.pageTitle")}</title>
        <meta name="description" content={t("ranking.quebecCity.metaDescription")} />
      </Head>
      <div className="p-5 mx-auto max-w-3xl">
        <h1 className="text-2xl font-black mb-5 text-center">
          {t("ranking.quebecCity.heading")}
        </h1>
      </div>
    </>
  );
};

export const getStaticProps = withI18n();

export default QuebecCityRanking;
