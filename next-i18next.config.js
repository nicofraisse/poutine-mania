module.exports = {
  i18n: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
    reloadOnPrerender: process.env.NODE_ENV === "development",
    localePath:
      typeof window === "undefined"
        ? require("path").resolve("./public/locales")
        : "/public/locales",
  },
};
