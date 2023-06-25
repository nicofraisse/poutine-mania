import Link from "next/link";
import React from "react";
import { User } from "react-feather";
import { useCurrentUser } from "../../lib/useCurrentUser";
import { Image } from "../Image";
import Skeleton from "react-loading-skeleton";

// eslint-disable-next-line
const cooltext =
  "Et ainsi, je me suis tourné vers le Seigneur et j&apos;ai prié pour trouver un sens à ma vie. Et la poutine fut ma réponse divine, la bénédiction culinaire qui me guide sur ce chemin sacré.";

const ProfileHeader = ({ user }) => {
  const { currentUser } = useCurrentUser();

  const isSkeleton = !user;
  return (
    <div className="text-slate-700 border bg-white py-6 px-4 sm:p-7 rounded mb-6">
      <div className="flex items-center flex-col sm:flex-row">
        <div className="sm:mr-7 flex items-center justify-center sm:block mb-5 sm:mb-0">
          {isSkeleton ? (
            <Skeleton
              className="min-w-28 max-w-28 h-28 sm:min-w-32 sm:h-32"
              circle
            />
          ) : user.image ? (
            <Image
              alt="user-image"
              quality={50}
              src={user.image}
              className="rounded-full min-w-28 max-w-28 h-28 sm:min-w-32 sm:h-32 object-cover flex-shrink-0 object-center"
            />
          ) : (
            <div className="min-w-28 h-28 sm:min-w-32 sm:h-32 rounded-full bg-gray-300 flex items-center flex-shrink-0 justify-center">
              <User className="text-white" size={64} />
            </div>
          )}
        </div>
        <div className="grow">
          <div className="flex items-center justify-center sm:justify-between mb-5">
            <div className="font-black text-2xl xs:text-3xl text-center sm:text-left md:pr-8">
              {isSkeleton ? <Skeleton width={220} height={32} /> : user.name}
            </div>
            <div className="sm:flex hidden">
              {isSkeleton ? (
                <Skeleton />
              ) : user._id === currentUser?._id ? (
                <Link href={`/users/${user._id}/edit`} passHref>
                  <button className="text-base font-bold bg-blue-400 px-6 py-2 rounded-full text-white inline-block">
                    Modifier mon profil
                  </button>
                </Link>
              ) : (
                <button className="mr-auto text-base font-bold bg-blue-400 px-6 py-2 rounded-full text-white inline-block">
                  Suivre
                </button>
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
                    Admin
                  </div>
                )}
                <div className="text-sm text-slate-500 bg-slate-100 border border-slate-100 px-3 py-1 rounded mr-2">
                  {user.eatenlist.length < 5
                    ? "Novice"
                    : user.eatenlist.length < 15
                    ? "Connaisseur"
                    : "Expert"}
                </div>
              </>
            )}
          </div>
          <p className="relative text-xs text-center sm:text-justify sm:text-sm text-slate-500">
            {isSkeleton ? (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            ) : (
              user.bio
            )}
          </p>
        </div>
      </div>
      <div className="text-center flex flex-col sm:flex-row w-full justify-between sm:px-6 sm:mt-8 sm:pt-4 mt-4 border-t border-slate-100">
        <div className="mt-4 mb-1">
          {isSkeleton ? (
            <Skeleton height={50} width={150} />
          ) : (
            user.profileStats?.lastEatenRestaurant?.name && (
              <>
                <div className="font-black text-slate-700 text-lg sm:text-xl">
                  😋 {user.profileStats.lastEatenRestaurant.name}
                </div>
                <div className="text-xs sm:text-sm text-slate-400">
                  Dernière poutine mangée
                </div>
              </>
            )
          )}
        </div>
        <div className="mt-4 mb-1">
          {isSkeleton ? (
            <Skeleton height={50} width={150} />
          ) : (
            user.profileStats?.favoriteRestaurant?.name && (
              <>
                <div className="font-black text-slate-600 text-lg sm:text-xl">
                  ❤️ {user.profileStats.favoriteRestaurant.name}
                </div>
                <div className="text-xs sm:text-sm text-slate-400">
                  Poutine préférée
                </div>
              </>
            )
          )}
        </div>
        <div className="mt-4 mb-1">
          {isSkeleton ? (
            <Skeleton height={50} width={150} />
          ) : (
            user.profileStats?.leastFavoriteRestaurant?.name && (
              <>
                <div className="font-black text-slate-700 text-lg sm:text-xl">
                  💔 {user.profileStats.leastFavoriteRestaurant.name}
                </div>
                <div className="text-xs sm:text-sm text-slate-400">
                  Poutine la moins aimée
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
