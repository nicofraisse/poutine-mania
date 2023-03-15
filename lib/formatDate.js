import { format } from "date-fns";
import fr from "date-fns/locale/fr-CA";

export const formatDate = (date, options) => {
  if (!date) return "";
  return format(new Date(date), options, { locale: fr });
};
