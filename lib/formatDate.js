import { format, formatDistanceToNow } from "date-fns";
import { i18n } from "next-i18next";
import fr from "date-fns/locale/fr-CA";
import enUS from "date-fns/locale/en-US";

export const formatDate = (date, pattern, ago = false) => {
  if (!date) return "";

  const dt = new Date(date);

  const lang = (i18n?.language || i18n?.options?.defaultLocale || "fr").split(
    "-"
  )[0];
  const localeObj = lang === "fr" ? fr : enUS;

  if (ago) {
    if (lang === "fr") {
      return (
        "il y a " +
        formatDistanceToNow(dt, { locale: localeObj, addSuffix: false })
      );
    } else {
      return formatDistanceToNow(dt, { locale: localeObj, addSuffix: true });
    }
  } else {
    return format(dt, pattern, { locale: localeObj });
  }
};
