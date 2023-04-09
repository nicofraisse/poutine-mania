import Link from "next/link";
import React from "react";
import { Home, Info, Lock, Map, User, Star, CheckCircle } from "react-feather";
import { useRouter } from "next/router";
import classNames from "classnames";
import { useCurrentUser } from "lib/useCurrentUser";
import ConditionalWrapper from "components/ConditionalWrapper";
import { useRequireLogin } from "../../lib/useRequireLogin";
import { useSidebarData } from "../context/SidebarDataProvider";
import { BrandLogo } from "../BrandLogo";
import { useSession } from "next-auth/client";

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
        <Link href={href} passHref>
          {children}
        </Link>
      )}
    >
      <div
        onClick={() => onClick(requireLogin, label, requireLoginMessage)}
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

const Sidebar = ({ showMobileSidebar, toggleMobileSidebar }) => {
  const [session, loading] = useSession();
  const currentUser = session?.user;
  const requireLogin = useRequireLogin();
  const { sidebarEatenlistAmount, sidebarWatchlistAmount } = useSidebarData();

  console.log("THE CURR", currentUser);

  const onClickItem = (isLoginRequired, label, requireLoginMessage) => {
    if (isLoginRequired) {
      requireLogin(
        toggleMobileSidebar,
        requireLoginMessage && (
          <div className="px-4 sm:w-[380px] ">
            <div className="py-2 px-3 my-2 bg-blue-100 border--200 text-gray-700 rounded borer">
              {/* <Info size={18} className='text-gray-700 inline mr-2' /> */}
              {requireLoginMessage}
            </div>
          </div>
        )
      );
    } else toggleMobileSidebar();
  };

  const getAmountString = (amount) => {
    if (!amount) return "";
    if (amount > 999) return " (999+)";
    return ` (${amount})`;
  };

  return (
    <>
      {showMobileSidebar && (
        <div
          className="bg-black fixed h-screen w-screen z-30 bg-opacity-40 block lg:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}
      <div
        className={classNames("fixed lg:static lg:block  lg:min-w-[228px]", {
          hidden: !showMobileSidebar,
          "block bg-white h-screen z-50": showMobileSidebar,
        })}
      >
        <nav
          className={classNames(
            "border-r lg:pt-2 bg-white h-screen lg:fixed lg:min-w-[228px] flex flex-col justify-between"
          )}
        >
          <div className="select-none">
            <Link href="/">
              <a>
                <BrandLogo />
              </a>
            </Link>
            {/* <Item
              onClick={onClickItem}
              label="Communauté"
              icon={Hash}
              href="/communaute"
            /> */}
            <Item onClick={onClickItem} label="Accueil" icon={Home} href="/" />
            <Item
              onClick={onClickItem}
              label="Poutines"
              icon={Map}
              href="/restaurants"
            />
            {/* <Item
              onClick={onClickItem}
              label="Derniers avis"
              icon={Hash}
              href="/"
            /> */}

            {/* <Item
              onClick={onClickItem}
              label="Mon top poutines"
              icon={Heart}
              href="mon-top"
              disabled
            /> */}

            <Item
              onClick={onClickItem}
              icon={Star}
              label={`À essayer${getAmountString(sidebarWatchlistAmount)}`}
              href="/a-essayer"
              requireLogin={!currentUser}
              requireLoginMessage={
                <span>
                  <b>Connectez-vous</b> accéder à votre liste de poutines à
                  essayer!
                </span>
              }
            />
            <Item
              onClick={onClickItem}
              label={`Mangées ${getAmountString(sidebarEatenlistAmount)}`}
              icon={CheckCircle}
              href={`/mes-poutines`}
              requireLogin={!currentUser}
              requireLoginMessage={
                <span>
                  <b>Connectez-vous</b> accéder à votre liste de poutines
                  mangées!
                </span>
              }
            />
            <Item
              onClick={onClickItem}
              label="Mon profil"
              icon={User}
              href={`/users/${currentUser?._id}`}
              requireLogin={!currentUser}
              requireLoginMessage=""
            />

            {/* <Item
              onClick={onClickItem}
              icon={BarChart2}
              label="Statistiques"
              href="watchlist"
              requireLogin={!currentUser}
            /> */}
            {currentUser?.isAdmin && (
              <Item
                onClick={onClickItem}
                label="Admin"
                icon={Lock}
                href="/admin"
              />
            )}
          </div>
          <div className="mb-3">
            <Item
              onClick={onClickItem}
              label="À Propos"
              icon={Info}
              href="/a-propos"
            />
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
