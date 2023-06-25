//pages/sitemap.xml.js
const BASE_URI = "https://poutinemania.ca";

function generateSiteMap(restaurants) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!--We manually set the two URLs we know already-->
      <url>
        <loc>${BASE_URI}</loc>
      </url>
      <url>
        <loc>${BASE_URI}/restaurants</loc>
      </url>
      <url>
        <loc>${BASE_URI}/a-propos</loc>
      </url>

      ${restaurants
        .map(
          ({ slug }) =>
            `<url>
              <loc>${BASE_URI}/restaurants/${slug}</loc>
            </url>
          `
        )
        .join("")}
    </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const request = await fetch(`${BASE_URI}/api/restaurants?noUnapproved=true`);
  const restaurants = await request.json();

  // We generate the XML sitemap with the restaurants data
  const sitemap = generateSiteMap(restaurants);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
