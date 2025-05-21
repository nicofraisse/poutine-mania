import fetch from "node-fetch";

const BASE_URI = process.env.NEXT_PUBLIC_APP_URL || "https://poutinemania.ca";

export default {
  siteUrl: BASE_URI,
  generateRobotsTxt: true,

  i18n: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
  },

  additionalPaths: async (config) => {
    const res = await fetch(`${BASE_URI}/api/restaurants?noUnapproved=true`);
    const restaurants = await res.json();

    const staticPages = ["/", "/noter", "/restaurants", "/a-propos"];

    const makeAltRefs = (path) =>
      config.i18n.locales
        .map((loc) => ({
          hreflang: loc,
          href:
            loc === config.i18n.defaultLocale
              ? `${BASE_URI}${path}`
              : `${BASE_URI}/${loc}${path}`,
        }))
        .concat({
          hreflang: "x-default",
          href: `${BASE_URI}${path}`,
        });

    const staticUrls = staticPages.map((loc) => ({
      loc,
      alternateRefs: makeAltRefs(loc),
    }));

    const dynamicUrls = restaurants.map(({ slug, updatedAt }) => {
      const loc = `/restaurants/${slug}`;
      return {
        loc,
        lastmod: new Date(updatedAt).toISOString(),
        alternateRefs: makeAltRefs(loc),
      };
    });

    return [...staticUrls, ...dynamicUrls];
  },
};
