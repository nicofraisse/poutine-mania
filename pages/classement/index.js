import Head from "next/head";
import { useTranslation } from "next-i18next";
import { withI18n } from "../../lib/withI18n";

const Ranking = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("ranking.pageTitle")}</title>
        <meta name="description" content={t("ranking.metaDescription")} />
      </Head>
      <div className="p-5 mx-auto max-w-3xl">
        <h1 className="text-2xl font-black mb-5 text-center">
          {t("ranking.title")}
        </h1>
      </div>
    </>
  );
};

export const getStaticProps = withI18n();

export default Ranking;
