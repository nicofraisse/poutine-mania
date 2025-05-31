import { useTranslation } from "next-i18next";

export default function DefaultSEO({ locale }) {
  const { t } = useTranslation("common");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const url = locale === "en" ? `${baseUrl}/en` : baseUrl;

  const images = {
    en: {
      og: `${baseUrl}/og-image-en.png`,
      twitter: `${baseUrl}/twitter-image-en.png`,
    },
    fr: {
      og: `${baseUrl}/og-image-fr.png`,
      twitter: `${baseUrl}/twitter-image-fr.png`,
    },
  };

  const currentLocale = locale === "en" ? "en" : "fr";
  const ogImage = images[currentLocale].og;
  const twitterImage = images[currentLocale].twitter;

  const title = t("seo.title");
  const description = t("seo.description");

  return (
    <>
      <meta name="description" content={description} />
      <meta name="image" content={ogImage} />

      <meta property="fb:app_id" content="572135587608476" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage} />
    </>
  );
}
