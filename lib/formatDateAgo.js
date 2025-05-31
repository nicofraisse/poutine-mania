import {
  format,
  formatDistanceToNow,
  differenceInHours,
  differenceInDays,
  isToday,
  isYesterday,
  startOfWeek,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import { i18n } from "next-i18next";
import fr from "date-fns/locale/fr-CA";
import enUS from "date-fns/locale/en-US";

export const formatDateAgo = (date, pattern, ago = false) => {
  if (!date) return "";

  const dt = new Date(date);
  const now = new Date();

  const lang = (i18n?.language || i18n?.options?.defaultLocale || "fr").split(
    "-"
  )[0];
  const localeObj = lang === "fr" ? fr : enUS;

  if (ago) {
    const hoursAgo = differenceInHours(now, dt);
    const daysAgo = differenceInDays(now, dt);
    const monthsAgo = differenceInMonths(now, dt);
    const yearsAgo = differenceInYears(now, dt);

    const translations = {
      fr: {
        today: "aujourd'hui",
        yesterday: "hier",
        twoDaysAgo: "il y a 2 jours",
        lastWeek: "la semaine dernière",
        lastMonth: "le mois dernier",
        lastYear: "l'année dernière",
        moreThanYear: "il y a plus d'un an",
        fallback: "il y a longtemps",
        hoursAgo: (h) => `il y a ${h} heure${h > 1 ? "s" : ""}`,
      },
      en: {
        today: "today",
        yesterday: "yesterday",
        twoDaysAgo: "2 days ago",
        lastWeek: "last week",
        lastMonth: "last month",
        lastYear: "last year",
        moreThanYear: "more than a year ago",
        fallback: "a while ago",
        hoursAgo: (h) => `${h} hour${h > 1 ? "s" : ""} ago`,
      },
    };

    const t = translations[lang] || translations.en;

    if (hoursAgo < 1) {
      if (lang === "fr") {
        return (
          "il y a " +
          formatDistanceToNow(dt, { locale: localeObj, addSuffix: false })
        );
      } else {
        return formatDistanceToNow(dt, { locale: localeObj, addSuffix: true });
      }
    }

    if (hoursAgo >= 1 && hoursAgo < 4) {
      return t.hoursAgo(hoursAgo);
    }

    if (hoursAgo >= 4 && isToday(dt)) {
      return t.today;
    }

    if (isYesterday(dt)) {
      return t.yesterday;
    }

    if ([1, 2].includes(daysAgo)) {
      return t.twoDaysAgo;
    }

    if (daysAgo >= 3) {
      const startOfThisWeek = startOfWeek(now, { locale: localeObj });
      const startOfLastWeek = startOfWeek(
        new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        { locale: localeObj }
      );

      if (dt >= startOfThisWeek) {
        if (lang === "fr") {
          return (
            "il y a " +
            formatDistanceToNow(dt, { locale: localeObj, addSuffix: false })
          );
        } else {
          return formatDistanceToNow(dt, {
            locale: localeObj,
            addSuffix: true,
          });
        }
      }

      if (dt >= startOfLastWeek && dt < startOfThisWeek) {
        return t.lastWeek;
      }

      if (monthsAgo < 1) {
        const weeksAgo = Math.floor(daysAgo / 7);
        if (weeksAgo >= 2) {
          if (lang === "fr") {
            return `il y a ${weeksAgo} semaine${weeksAgo > 1 ? "s" : ""}`;
          } else {
            return `${weeksAgo} weeks ago`;
          }
        } else {
          if (lang === "fr") {
            return (
              "il y a " +
              formatDistanceToNow(dt, { locale: localeObj, addSuffix: false })
            );
          } else {
            return formatDistanceToNow(dt, {
              locale: localeObj,
              addSuffix: true,
            });
          }
        }
      }
    }

    if (monthsAgo >= 1 && monthsAgo < 2) {
      return t.lastMonth;
    }

    if (monthsAgo >= 2 && yearsAgo < 1) {
      if (lang === "fr") {
        return (
          "il y a " +
          formatDistanceToNow(dt, { locale: localeObj, addSuffix: false })
        );
      } else {
        return formatDistanceToNow(dt, { locale: localeObj, addSuffix: true });
      }
    }

    if (yearsAgo === 1) {
      return t.lastYear;
    }

    if (yearsAgo > 1) {
      return t.moreThanYear;
    }

    return t.fallback;
  } else {
    return format(dt, pattern, { locale: localeObj });
  }
};
