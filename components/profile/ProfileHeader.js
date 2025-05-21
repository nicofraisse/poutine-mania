import Link from "next/link";
import React from "react";
import { User } from "react-feather";
import { useCurrentUser } from "../../lib/useCurrentUser";
import { Image } from "../Image";
import Skeleton from "react-loading-skeleton";
import { Linkify } from "../Linkify.js";
import classNames from "classnames";
import { useTranslation } from "next-i18next";

const ProfileHeader = ({ user }) => {
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();

  const isSkeleton = !user;
  const eatenCount = user?.eatenlist?.length || 0;

  const levelKey =
    eatenCount < 5
      ? "levelNovice"
      : eatenCount < 15
      ? "levelConnoisseur"
      : "levelExpert";

  return (
    <div className="text-slate-700 border bg-white py-6 px-4 sm:p-7 rounded mb-6">
      <div className="flex items-center flex-col sm:flex-row">
        <div className="sm:mr-7 w-28 h-28 sm:min-w-32 sm:w-32 sm:h-32 flex items-center justify-center sm:block mb-5 relative sm:mb-0">
          {isSkeleton ? (
            <Skeleton
              className="min-w-28 max-w-28 h-28 sm:min-w-32 sm:h-32"
              circle
            />
          ) : user.image ? (
            <Image
              alt={t("userProfile.profileHeader.imageAlt")}
              quality={50}
              src={user.image}
              className="rounded-full object-cover flex-shrink-0 object-center w-full h-full"
            />
          ) : (
            <div className="min-w-28 h-28 sm:min-w-32 sm:h-32 rounded-full bg-gray-300 flex items-center flex-shrink-0 justify-center">
              <User className="text-white" size={64} />
            </div>
          )}
        </div>
        <div className="grow sm:w-3/4">
          <div className="flex items-center justify-center sm:justify-between mb-5 ">
            <div className="font-black text-2xl xs:text-3xl text-center sm:text-left md:pr-8">
              {isSkeleton ? <Skeleton width={220} height={32} /> : user.name}
            </div>
            <div className="sm:flex hidden">
              {isSkeleton ? (
                <Skeleton />
              ) : user._id === currentUser?._id ? (
                <Link
                  legacyBehavior
                  href={`/profil/${user.slug}/edit`}
                  passHref
                >
                  <button className="text-base font-bold bg-blue-400 px-6 py-2 rounded-full text-white inline-block">
                    {t("userProfile.profileHeader.editProfile")}
                  </button>
                </Link>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="flex items-start justify-center sm:justify-start flex-wrap py-1 -mt-4 mb-3">
            {isSkeleton ? (
              <>
                <Skeleton width={70} height={28} className="mr-2" />
                <Skeleton width={70} height={28} />
              </>
            ) : (
              <>
                {user.isAdmin && (
                  <div className="text-sm border border-yellow-600 text-yellow-600 px-3 py-1 rounded mr-2">
                    {t("userProfile.profileHeader.admin")}
                  </div>
                )}
                <div className="text-sm text-slate-500 bg-slate-100 border border-slate-100 px-3 py-1 rounded mr-2">
                  {t(`userProfile.profileHeader.${levelKey}`)}
                </div>
              </>
            )}
          </div>

          <div className="sm:hidden flex justify-center">
            {isSkeleton ? (
              <Skeleton />
            ) : (
              user._id === currentUser?._id && (
                <Link
                  legacyBehavior
                  href={`/profil/${user.slug}/edit`}
                  passHref
                >
                  <button className="text-base font-bold bg-blue-400 px-6 py-2 rounded-full text-white inline-block">
                    {t("userProfile.profileHeader.editProfile")}
                  </button>
                </Link>
              )
            )}
          </div>

          <p className="relative text-xs text-center sm:text-justify sm:text-sm text-slate-500 whitespace-pre-line break-words sm:w-3/4">
            {isSkeleton ? (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            ) : (
              <Linkify legacyBehaviorify>
                {!(user.bio === "undefined") && user.bio}
              </Linkify>
            )}
          </p>
        </div>
      </div>
      <div
        className={classNames(
          "text-center flex flex-col sm:flex-row w-full justify-between sm:px-6 sm:mt-8 sm:pt-4 mt-4 border-t border-slate-100",
          {
            hidden:
              user &&
              !user.profileStats?.lastEatenRestaurant?.name &&
              !user.profileStats?.favoriteRestaurant?.name &&
              !user.profileStats?.leastFavoriteRestaurant?.name,
          }
        )}
      >
        <div className="mt-4 mb-1 px-2">
          {isSkeleton ? (
            <Skeleton height={50} width={150} />
          ) : (
            user.profileStats?.lastEatenRestaurant?.name && (
              <>
                <div className="font-black text-slate-700 text-lg sm:text-xl">
                  😋 {user.profileStats.lastEatenRestaurant.name}
                </div>
                <div className="text-xs sm:text-sm text-slate-400">
                  {t("userProfile.profileHeader.lastEatenLabel")}
                </div>
              </>
            )
          )}
        </div>
        <div className="mt-4 mb-1 px-2">
          {isSkeleton ? (
            <Skeleton height={50} width={150} />
          ) : (
            user.profileStats?.favoriteRestaurant?.name && (
              <>
                <div className="font-black text-slate-600 text-lg sm:text-xl">
                  ❤️ {user.profileStats.favoriteRestaurant.name}
                </div>
                <div className="text-xs sm:text-sm text-slate-400">
                  {t("userProfile.profileHeader.favoriteLabel")}
                </div>
              </>
            )
          )}
        </div>
        <div className="mt-4 mb-1 px-2">
          {isSkeleton ? (
            <Skeleton height={50} width={150} />
          ) : (
            user.profileStats?.leastFavoriteRestaurant?.name && (
              <>
                <div className="font-black text-slate-700 text-lg sm:text-xl">
                  💔 {user.profileStats.leastFavoriteRestaurant.name}
                </div>
                <div className="text-xs sm:text-sm text-slate-400">
                  {t("userProfile.profileHeader.leastFavoriteLabel")}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
