import Spinner from "../components/Spinner";
import ProfileReviewCard from "../components/ProfileReviewCard";
import { useGet } from "../lib/useAxios";
import { Image as ImageIcon } from "react-feather";
import { useEffect, useState } from "react";
import { MapPin } from "react-feather";
import classNames from "classnames";
import RatingPill from "../components/RatingPill";
import Link from "next/link";
import { Image } from "../components/Image";

import { useRouter } from "next/router";

function TopPoutines() {
  const { push } = useRouter();

  const { data: restaurants, loading: restaurantsLoading } = useGet(
    `/api/restaurants?sort=avgRating&order=-1&limit=10&noUnapproved=true`
  );

  return (
    <div className="md:pl-2 pt-2 xl:pl-5 lg:flex max-w-4xl mx-auto">
      <div className="grow">
        <div className="px-2 md:px-0">
          <h1 className="text-2xl sm:text-3xl font-bold my-4">
            Les 10 meilleures poutines du Québec
          </h1>
          <p className="my-1 text-sm sm:text-md">
            Bienvenue sur notre application de notation de poutines! Grâce à
            notre plateforme, vous pouvez non seulement enregistrer vos propres
            expériences de dégustation de poutines, mais aussi découvrir celles
            des autres utilisateurs dans votre région et partout ailleurs au
            Québec. Partagez vos avis sur les meilleures poutines que vous avez
            goûtées et découvrez de nouvelles poutineries à essayer grâce à
            notre communauté en ligne de passionnés de poutines. Rejoignez-nous
            dès maintenant et trouvez votre prochaine poutine préférée!
          </p>

          <h2 className="mt-4 mb-3 text-lg sm:text-xl font-bold">
            Vous cherchez une poutine proche de chez vous?
          </h2>

          <p className="my-1 text-sm sm:text-md">
            Vous cherchez une poutine avec des critères plus précis? Utilisez
            notre{" "}
            <Link href={"/restaurants"} passHref>
              <span className="text-teal-500 font-bold cursor-pointer hover:text-teal-600">
                carte des poutines
              </span>
            </Link>
            , où vous trouverez les meilleurs restaurants en fonction du lieu,
            le type de restaurant, la note moyenne sur 10, et bien plus.
          </p>
        </div>
        <div className="shadow-lg border-white border-4 rounded-lg mb-40 mt-6">
          {restaurants ? (
            restaurants.map((r, i) => {
              const image = r.reviews?.find((res) => res.photos?.[0])
                ?.photos[0];
              return (
                <div
                  key={r._id}
                  className={classNames(
                    "xs:pt-3 xs:pr-3 pt-5 pb-6 xs:pb-3 2xl:pt-3 2xl:pr-3 border-gray-200 bg-opacity-50",
                    {
                      "bg-slate-100": i % 2 === 0,
                      "bg-white": i % 2 !== 0,
                    }
                  )}
                >
                  <div className="flex flex-col xs:flex-row items-center">
                    <div
                      className={classNames(
                        "min-w-12 sm:min-w-16 md:min-w-24 flex justify-center mb-2 sm:mb-0 items-center",
                        {
                          "mb-3 xs:mb-0 text-5xl": i < 3,
                          "text-2xl font-black text-gray-600": i >= 3,
                        }
                      )}
                    >
                      <span>
                        {i === 0
                          ? "🥇"
                          : i === 1
                          ? "🥈"
                          : i === 2
                          ? "🥉"
                          : `#${i + 1}`}
                      </span>
                      <div className="xs:hidden flex items-center ml-2">
                        <Link href={`/restaurants/${r._id}`} passHref>
                          <a className="text-xl lg:text-2xl font-bold text-teal-500 hover:text-teal-600">
                            {r.name}
                          </a>
                        </Link>
                      </div>
                    </div>
                    {image ? (
                      <Image
                        src={image}
                        alt={`${r.name}-photo`}
                        className="h-48 xs:h-32 lg:h-36 w-[80%] xs:w-auto xs:min-w-36 sm:min-w-40 lg:min-w-48 object-cover object-center rounded mr-3 sm:mr-4 lg:mr-8 mb-3 xs:mb-0"
                      />
                    ) : (
                      <div className="h-48 xs:h-32 lg:h-36 w-[80%] xs:w-auto xs:min-w-36 sm:min-w-40 lg:min-w-48 flex items-center justify-center mr-3 sm:mr-4 lg:mr-8 mb-3 xs:mb-0 rounded bg-gray-100">
                        <ImageIcon
                          className="text-gray-400"
                          size={48}
                          alt="placeholder"
                        />
                      </div>
                    )}
                    <div className="w-full px-2 xs:px-0 text-center xs:text-left">
                      <div className="">
                        <div className="hidden xs:block">
                          <Link href={`/restaurants/${r._id}`} passHref>
                            <a className="text-xl lg:text-2xl font-bold text-teal-500 mb-2 text-left hover:text-teal-600">
                              {r.name}
                            </a>
                          </Link>
                        </div>
                        <div className="-ml-1 xs:mb-2 flex items-center justify-center xs:justify-start">
                          <RatingPill
                            avgRating={r.avgRating}
                            reviewCount={r.reviewCount}
                            hideCount
                            isStar
                          />
                          <button
                            className="mx-1 underline text-gray-500"
                            onClick={() => push(`/restaurants/${r._id}/noter`)}
                          >
                            Noter
                          </button>
                        </div>
                      </div>
                      {/* <TagSection
                      succursales={r.succursales}
                      categories={r.categories}
                      city={
                        r.succursales[0].address?.context?.find((el) =>
                          el.id?.includes('neighborhood')
                        )?.text
                      }
                      priceRange={r.priceRange}
                      largeText
                    /> */}

                      <div className="text-sm text-gray-400">
                        <MapPin size={16} className="inline mt-[-2px]" />{" "}
                        {r.succursales.length === 1
                          ? r.succursales[0].address.place_name.split(", Q")[0]
                          : `${r.succursales.length} adresses au Québec`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
}

export default TopPoutines;
