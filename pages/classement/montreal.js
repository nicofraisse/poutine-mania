import Head from "next/head";
import { useTranslation } from "next-i18next";
import { withI18n } from "../../lib/withI18n";

const keywords = "avis poutine, chez poutine, critique poutine, la meilleur poutine de montreal, la meilleure poutine à montréal, la meilleure poutine de montreal, le s poutine, les meilleurs poutines de montreal, livraison poutine montreal, livraison poutine montréal, manger poutine montreal, manger une poutine a montreal, meilleur poutine de montreal, meilleur poutine montréal, meilleur restaurant de poutine a montreal, meilleure poutine à montréal, meilleure poutine de montreal, meilleure poutine de montréal, meilleure poutine livraison montréal, meilleure poutine montréal 2021, montréal poutine, montreal restaurant poutine, poutine à montréal, poutine de montreal, poutine en montreal, poutine livraison montreal, poutine livraison montréal, poutine montréal, poutine montreal livraison, poutine mtl, restaurant a poutine, restaurant de poutine, restaurant de poutine montreal, restaurant poutine a montreal, restaurant poutine montréal, resto de poutine, resto la poutine, resto poutine montreal";

const MontrealRanking = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("ranking.montreal.pageTitle")}</title>
        <meta name="description" content={t("ranking.montreal.metaDescription")} />
        <meta name="keywords" content={keywords} />
      </Head>
      <div className="p-5 mx-auto max-w-3xl">
        <h1 className="text-2xl font-black mb-5 text-center">
          {t("ranking.montreal.heading")}
        </h1>
        <p className="mb-4">{t("ranking.montreal.intro")}</p>
      </div>
    </>
  );
};

export const getStaticProps = withI18n();

export default MontrealRanking;
