// formatDate.js
import { format, formatDistanceToNow } from "date-fns";
import fr from "date-fns/locale/fr-CA";

export const formatDate = (date, options, ago) => {
  if (!date) return "";

  const currentDate = new Date(date);

  if (ago) {
    return (
      "il y a " +
      formatDistanceToNow(currentDate, { locale: fr, addSuffix: false })
    );
  } else {
    return format(currentDate, options, { locale: fr });
  }
};
