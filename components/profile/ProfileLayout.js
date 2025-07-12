// components/layout/ProfileLayout.js
import classNames from "classnames";
import { useRouter } from "next/router";
import React from "react";
import ProfileHeader from "../profile/ProfileHeader";
import { useGet } from "../../lib/useAxios";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const Tab = ({ isSelected, href, title, description }) => (
  <Link href={href}>
    <div
      className={classNames(
        "w-32 h-20 mr-2 cursor-pointer select-none z-0 flex flex-col justify-center items-center group",
        {
          "bg-white rounded-t border-t border-r border-l text-slate-600 font-black":
            isSelected,
          "bg-transparent border border-transparent text-slate-400 font-normal":
            !isSelected,
        }
      )}
    >
      <div className="text-center">
        <span className="text-2xl" style={{ fontSize: 28 }}>
          {title}
        </span>
        <div
          className={classNames("text-sm group-hover:text-slate-500", {
            "mt-[1px]": isSelected,
          })}
        >
          {description}
        </div>
      </div>
    </div>
  </Link>
);

export const ProfileLayout = ({ children }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const { data: user } = useGet(`/api/users/${id}`, { skip: !id });

  const tabs = [
    {
      title: t("userProfile.tab1.title"),
      description: t("userProfile.tab1.description"),
      href: `/profil/${id}`,
      path: `/users/[id]`,
    },
    {
      title: t("userProfile.tab2.title"),
      description: t("userProfile.tab2.description"),
      href: `/profil/${id}/avis`,
      path: `/users/[id]/avis`,
    },
    // {
    //   title: "🗺️",
    //   description: "Carte",
    //   href: `/profil/${id}/carte`,
    //   path: `/users/[id]/carte`,
    // },
  ];

  const currentTab = tabs.find((tab) => tab.path === router.pathname);
  const currentTabIndex = tabs.indexOf(currentTab);

  return (
    <div className="p-0 sm:p-10 w-full">
      <div className="max-w-md w-screen sm:w-auto mx-auto">
        <ProfileHeader user={user} />
        <div className="flex mt-3 -mb-[1px]">
          {tabs.map((tab, i) => (
            <Tab
              key={i}
              isSelected={currentTabIndex === i}
              href={tab.href}
              title={tab.title}
              description={tab.description}
            />
          ))}
        </div>
        <div className="bg-white sm:p-5 sm:rounded-b rounded-r border">
          {children}
        </div>
      </div>
    </div>
  );
};
