import Link from "next/link";
import React, { useEffect } from "react";
import {
  Home,
  Info,
  Lock,
  Map,
  User,
  Star,
  CheckCircle,
  Edit3,
} from "react-feather";
import { useRouter } from "next/router";
import classNames from "classnames";
import ConditionalWrapper from "components/ConditionalWrapper";
import { useRequireLogin } from "../../lib/useRequireLogin";
import { useSidebarData } from "../context/SidebarDataProvider";
import { BrandLogo } from "../BrandLogo";
import { useSession } from "next-auth/react";
import { Trans, useTranslation } from "next-i18next";

const Item = ({
  label,
  href,
  icon,
  disabled,
  onClick,
  requireLogin,
  requireLoginMessage,
}) => {
  const { pathname } = useRouter();
  const isActive = pathname?.split("/")[1] === href.split("/")[1];
  const Icon = icon;

  return (
    <ConditionalWrapper
      condition={!requireLogin}
      wrapper={(children) => (
        <Link legacyBehavior href={href} passHref>
          {children}
        </Link>
      )}
    >
      <div
        onClick={() => onClick(requireLogin, requireLoginMessage)}
        className={classNames(
          "flex items-center p-3 pl-4 text-base cursor-pointer select-none transition duration-100",
          {
            "bg-orange-100 font-bold text-orange-600": isActive,
            "hover:bg-orange-100": !disabled,
            "text-gray-300 hover:bg-white cursor-default pointer-events-none":
              disabled,
          }
        )}
      >
        <span className="mr-3">
          <Icon size={22} />
        </span>
        {label}
      </div>
    </ConditionalWrapper>
  );
};

export const Sidebar = ({ showMobileSidebar, toggleMobileSidebar }) => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const currentUser = session?.user;
  const requireLogin = useRequireLogin();
  const { sidebarEatenlistAmount, sidebarWatchlistAmount } = useSidebarData();

  const onClickItem = (isLoginRequired, requireLoginMessage) => {
    if (isLoginRequired) {
      requireLogin(
        toggleMobileSidebar,
        requireLoginMessage && (
          <div className="px-4 sm:w-[380px] ">
            <div className="py-2 px-3 my-2 bg-blue-100 border--200 text-gray-700 rounded borer">
              {requireLoginMessage}
            </div>
          </div>
        )
      );
    } else toggleMobileSidebar();
  };

  useEffect(() => {
    document.querySelector("html").style.overflow =
      showMobileSidebar && window.innerWidth < 1080 ? "hidden" : "auto";
  }, [showMobileSidebar]);

  const getAmountString = (amount) => {
    if (!amount) return "";
    if (amount > 999) return " (999+)";
    return ` (${amount})`;
  };

  return (
    <>
      {showMobileSidebar && (
        <div
          className="bg-black fixed h-screen w-screen z-[250] bg-opacity-40 block lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
      <div
        className={classNames(
          "fixed lg:sticky lg:top-0 lg:block lg:min-w-[228px] h-screen bg-white z-[500] transform transition-transform duration-300 ease-in-out",
          {
            "translate-x-0": showMobileSidebar,
            "-translate-x-full lg:translate-x-0": !showMobileSidebar,
          }
        )}
      >
        <nav
          className={classNames(
            "border-r lg:pt-2 bg-white h-screen lg:fixed lg:min-w-[228px] flex flex-col justify-between"
          )}
        >
          <div className="select-none">
            <Link legacyBehavior href="/">
              <a>
                <BrandLogo />
              </a>
            </Link>

            <Item
              onClick={onClickItem}
              label={t("sidebar.home")}
              icon={Home}
              href="/"
            />
            <Item
              onClick={onClickItem}
              label={t("sidebar.restaurants")}
              icon={Map}
              href="/restaurants"
            />
            <Item
              onClick={onClickItem}
              label={t("sidebar.rate")}
              icon={Edit3}
              href="/noter"
            />

            <Item
              onClick={onClickItem}
              icon={Star}
              label={`${t("sidebar.toTry")}${getAmountString(
                sidebarWatchlistAmount
              )}`}
              href="/a-essayer"
              requireLogin={!currentUser}
              requireLoginMessage={
                <Trans
                  i18nKey="sidebar.message.loginToTry"
                  components={[<strong key="0" />]}
                />
              }
            />
            <Item
              onClick={onClickItem}
              label={`${t("sidebar.eaten")}${getAmountString(
                sidebarEatenlistAmount
              )}`}
              icon={CheckCircle}
              href={`/mes-poutines`}
              requireLogin={!currentUser}
              requireLoginMessage={
                <Trans
                  i18nKey="sidebar.message.loginToEaten"
                  components={[<strong key="0" />]}
                />
              }
            />
            <Item
              onClick={onClickItem}
              label={t("sidebar.profile")}
              icon={User}
              href={`/profil/${currentUser?.slug}`}
              requireLogin={!currentUser}
              requireLoginMessage=""
            />

            {currentUser?.isAdmin && (
              <Item
                onClick={onClickItem}
                label={t("sidebar.admin")}
                icon={Lock}
                href="/admin"
              />
            )}
          </div>

          <div className="sticky bottom-0 pb-3">
            <Item
              onClick={onClickItem}
              label={t("sidebar.about")}
              icon={Info}
              href="/a-propos"
            />
          </div>
        </nav>
      </div>
    </>
  );
};
