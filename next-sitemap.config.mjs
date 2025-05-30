import fetch from "node-fetch";

const BASE_URI = process.env.NEXT_PUBLIC_APP_URL || "https://poutinemania.ca";

export default {
  siteUrl: BASE_URI,
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/**", "/api/**", "/oauth-callback"],
  i18n: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
  },

  additionalPaths: async (config) => {
    const res = await fetch(`${BASE_URI}/api/restaurants?noUnapproved=true`);
    const restaurants = await res.json();

    // base static routes
    const staticPages = ["/", "/noter", "/restaurants", "/a-propos"];

    // base dynamic routes
    const dynamicPaths = restaurants.map(({ slug }) => `/restaurants/${slug}`);

    const basePaths = [...staticPages, ...dynamicPaths];

    return basePaths.flatMap((basePath) => {
      // find the matching restaurant to grab updatedAt or default to now()
      const restaurant = restaurants.find((r) => basePath.endsWith(r.slug));
      const isoDate = restaurant
        ? new Date(restaurant.updatedAt).toISOString()
        : new Date().toISOString();

      // emit one entry per locale with proper loc, lastmod, and alternates
      return config.i18n.locales.map((loc) => {
        const isDefault = loc === config.i18n.defaultLocale;
        const locPath = isDefault ? basePath : `/${loc}${basePath}`;

        // build alternateRefs for every locale + x-default
        const alternateRefs = config.i18n.locales
          .map((alt) => ({
            hreflang: alt,
            href:
              alt === config.i18n.defaultLocale
                ? `${BASE_URI}${basePath}`
                : `${BASE_URI}/${alt}${basePath}`,
          }))
          .concat({ hreflang: "x-default", href: `${BASE_URI}${basePath}` });

        return {
          loc: `${BASE_URI}${locPath}`,
          lastmod: isoDate,
          alternateRefs,
        };
      });
    });
  },
};
