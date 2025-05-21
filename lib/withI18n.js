import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../next-i18next.config.js";

export const withI18n = (gsp, namespaces = []) => {
  return async (ctx) => {
    const localeProps = await serverSideTranslations(
      ctx.locale,
      ["common", ...namespaces],
      nextI18NextConfig
    );
    if (gsp) {
      const result = await gsp(ctx);
      return {
        ...result,
        props: {
          ...("props" in result ? result.props : {}),
          ...localeProps,
        },
      };
    }
    return { props: { ...localeProps } };
  };
};
