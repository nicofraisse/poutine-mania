export default function DefaultSEO() {
  const image = `${process.env.NEXT_PUBLIC_APP_URL}/poutine-mania-og-image.png`;
  const url = process.env.NEXT_PUBLIC_APP_URL;
  const description =
    "Découvrez, notez et partagez les meilleures poutines au Québec sur Poutine Mania.";
  const title = "Poutine Mania - Note tes poutines préférées!";

  return (
    <>
      <meta name="image" content={image} />
      <meta property="fb:app_id" content="572135587608476" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </>
  );
}
