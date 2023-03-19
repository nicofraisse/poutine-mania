import Link from "next/link";
import React from "react";
import { User } from "react-feather";
import { useCurrentUser } from "../../lib/useCurrentUser";
import { Image } from "../Image";

const ProfileHeader = ({ user }) => {
  const { currentUser } = useCurrentUser();
  return (
    <div className="text-slate-700 border bg-white p-7 rounded mb-6">
      <div className="flex">
        <div className="mr-7">
          {user.image ? (
            <Image
              alt="user-image"
              src={user.image}
              className="rounded-full w-28 h-28 sm:w-36 sm:h-36 object-cover flex-shrink-0 object-center"
            />
          ) : (
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gray-300 flex items-center flex-shrink-0 justify-center">
              <User className="text-white" size={64} />
            </div>
          )}
        </div>
        <div>
          <div className="w-full flex items-center justify-between flex-wrap mb-5">
            <div>
              <div className="font-black text-3xl">{user.name}</div>
            </div>
            <div className="flex">
              {/* <Link href={"/noter"} passHref>
                <div
                  className="inline-flex justify-center items-center py-2 px-6  mr-2 border-gray-100 border-1 rounded-full text-neutral-400 cursor-pointer select-none hover:text-neutral-500 hover:border-neutral-300 transition-colors duration-200
          "
                >
                  <LinkIcon className="mr-2" size={20} />
                  Partager
                </div>
              </Link> */}
              {user._id === currentUser?._id ? (
                <Link href={`/users/${user._id}/edit`} passHref>
                  <button className="text-base font-bold bg-blue-400 px-6 py-2 rounded-full text-white inline-block">
                    Modifier mon profil
                  </button>
                </Link>
              ) : (
                <button className="text-base font-bold bg-blue-400 px-6 py-2 rounded-full text-white inline-block">
                  Suivre
                </button>
              )}
            </div>
          </div>
          <div className="flex items-start flex-wrap py-1 -mt-4 mb-3">
            <div className="text-sm border border-yellow-600 text-yellow-600 px-3 py-1 rounded mr-2">
              Admin
            </div>
            <div className="text-sm text-slate-500 bg-slate-100 border border-slate-100 px-3 py-1 rounded mr-2">
              Novice
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam
            nam molestias provident libero velit vero, magni in sunt mollitia
            earum natus reprehenderit? Dolorem quidem quasi aliquid doloribus,
            autem sunt laborum?
          </p>
        </div>
      </div>
      <div className="text-center flex w-full justify-between px-6 mt-8 pt-4 border-t border-slate-100">
        <div className="mt-4 mb-1">
          <div className="font-black text-slate-600 text-xl">❤️ Greenspot</div>
          <div className="text-sm text-slate-400">Poutine préférée</div>
        </div>
        <div className="mt-4 mb-1">
          <div className="font-black text-slate-700 text-xl">
            💔 Harvey&apos;s
          </div>
          <div className="text-sm text-slate-400">Poutine la moins aimée</div>
        </div>
        <div className="mt-4 mb-1">
          <div className="font-black text-slate-700 text-xl">
            😋 Patati Patata
          </div>
          <div className="text-sm text-slate-400">Dernière poutine mangée</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
