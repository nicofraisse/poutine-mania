const BASE_URI = "https://poutinemania.ca";

function generateSiteMap(restaurants) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${BASE_URI}</loc></url>
    <url><loc>${BASE_URI}/noter</loc></url>
    <url><loc>${BASE_URI}/restaurants</loc></url>
    <url><loc>${BASE_URI}/a-propos</loc></url>

    ${restaurants
      .map(
        ({ slug, updatedAt }) => `
      <url>
        <loc>${BASE_URI}/restaurants/${slug}</loc>
        <lastmod>${new Date(updatedAt).toISOString()}</lastmod>
      </url>
    `
      )
      .join("")}
  </urlset>
`;
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  const request = await fetch(`${BASE_URI}/api/restaurants?noUnapproved=true`);
  const restaurants = await request.json();

  const sitemap = generateSiteMap(restaurants);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
