import fetch from "node-fetch";

const BASE_URI = process.env.NEXT_PUBLIC_APP_URL || "https://poutinemania.ca";

export default {
  siteUrl: BASE_URI,
  generateRobotsTxt: true,
  exclude: [
    "/admin",
    "/admin/**",
    "/api/**",
    "/oauth-callback",
    "/", // Prevent duplicate homepage
  ],
  i18n: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
  },

  additionalPaths: async (config) => {
    const res = await fetch(`${BASE_URI}/api/restaurants?noUnapproved=true`);
    const restaurants = await res.json();

    // Static pages
    const staticPages = [
      { path: "/", priority: 1.0, changefreq: "daily" },
      { path: "/restaurants", priority: 0.9, changefreq: "daily" },
      { path: "/noter", priority: 0.7, changefreq: "weekly" },
      { path: "/a-propos", priority: 0.5, changefreq: "monthly" },
    ];

    // Featured profile pages
    const profilePages = [
      { path: "/profil/poutine-jesus", priority: 0.6, changefreq: "weekly" },
    ];

    const restaurantPages = restaurants.map((restaurant) => {
      const reviewCount = restaurant.reviewCount || 0;
      let priority = 0.6;
      if (reviewCount >= 5) priority = 0.8;
      else if (reviewCount >= 2) priority = 0.7;
      else if (reviewCount >= 1) priority = 0.65;

      const changefreq = reviewCount >= 5 ? "daily" : "weekly";

      return {
        path: `/restaurants/${restaurant.slug}`,
        priority,
        changefreq,
        restaurant,
      };
    });

    const allPages = [...staticPages, ...profilePages, ...restaurantPages];

    return allPages.flatMap((pageConfig) => {
      const { path, priority, changefreq, restaurant } = pageConfig;

      let lastmod;
      if (restaurant) {
        // Use lastReviewDate if available, otherwise fall back to updatedAt, then createdAt
        const dates = [
          restaurant.lastReviewDate,
          restaurant.updatedAt,
          restaurant.createdAt,
        ].filter(Boolean);
        lastmod =
          dates.length > 0
            ? new Date(dates[0]).toISOString()
            : new Date().toISOString();
      } else {
        // For static pages, use current date
        lastmod = new Date().toISOString();
      }

      // Generate fianl path for each locale
      return config.i18n.locales.map((locale) => {
        const isDefault = locale === config.i18n.defaultLocale;
        const locPath = isDefault ? path : `/${locale}${path}`;

        const alternateRefs = config.i18n.locales
          .map((alt) => ({
            hreflang: alt,
            href:
              alt === config.i18n.defaultLocale
                ? `${BASE_URI}${path}`
                : `${BASE_URI}/${alt}${path}`,
          }))
          .concat({ hreflang: "x-default", href: `${BASE_URI}${path}` });

        return {
          loc: `${BASE_URI}${locPath}`,
          lastmod,
          priority,
          changefreq,
          alternateRefs,
        };
      });
    });
  },
};
