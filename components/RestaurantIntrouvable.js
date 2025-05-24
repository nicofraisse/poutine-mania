import React from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Button, { VariantColor } from "./Button";
import { useLoginForm } from "./context/LoginFormProvider";
import { useCurrentUser } from "lib/useCurrentUser";
import { Plus } from "react-feather";
import classNames from "classnames";

const LoginMessage = () => {
  const { t } = useTranslation();
  return (
    <div className="px-4 sm:w-[380px]">
      <div className="py-2 px-3 my-2 bg-blue-100 border--200 text-slate-700 rounded borer">
        <strong>{t("loginMessage.strong")}</strong> {t("loginMessage.text")}
      </div>
    </div>
  );
};

const RestaurantIntrouvable = ({ hideBorders }) => {
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { openLogin } = useLoginForm();
  const { push, locale } = useRouter();

  const handleClickAdd = () => {
    const redirectUrl =
      locale === "en" ? "/en/nouveau-restaurant" : "/nouveau-restaurant";
    if (!currentUser) {
      openLogin({
        message: <LoginMessage />,
        redirect: redirectUrl,
      });
    } else {
      push(redirectUrl);
    }
  };

  return (
    <div
      className={classNames(
        "bg-white py-3 xs:px-5 xs:py-4 flex text-center xs:text-left items-center justify-center xs:flex-row",
        { "border-b": !hideBorders }
      )}
    >
      <div>
        <div className="font-bold text-sm xs:text-base text-slate-500 mr-4">
          {t("restaurantIntrouvable.title")}
        </div>
      </div>
      <Button
        variant={VariantColor.light}
        size="sm"
        height="sm"
        className="min-w-[120px] text-light text-sm mx:mt-0"
        onClick={handleClickAdd}
        type="button"
      >
        <Plus className="mr-1 text-gray -ml-1" size={16} />
        {t("restaurantIntrouvable.add")}
      </Button>
    </div>
  );
};

export default RestaurantIntrouvable;
