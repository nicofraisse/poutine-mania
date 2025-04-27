import { Spinner } from "components/Spinner";
import { Image as ImageIcon, Star } from "react-feather";
import { MapPin } from "react-feather";
import classNames from "classnames";
import Link from "next/link";
import { Image } from "components/Image";

import { IngredientRatingPills } from "../IngredientRatingPills";
import { formatRating } from "../../lib/formatRating";

export const TopPoutines = ({ restaurants }) => {
  return (
    <div className="max-w-4xl">
      <div className="sm:py-1 px-5 md:py-2 lg:px-6 text-center lg:pt-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold my-4">
          Top 10 meilleures poutines
        </h2>
        <h2>
          Selon les votes de notre communauté, voici les meilleures poutines à
          absolument essayer!
        </h2>
      </div>

      <div className="sm:shadow-lg sm:border-white sm:border-4 rounded-lg sm:mb-16 xl:mb-20 mt-6">
        {restaurants ? (
          restaurants.map((r, i) => {
            const image = r.reviews?.find((res) => res.photos?.[0])?.photos[0];
            return (
              <div
                key={r._id}
                className={classNames(
                  "xs:pt-3 xs:pr-3 pt-5 pb-6 xs:pb-3 2xl:pt-3 2xl:pr-3 bg-white flex flex-col xs:flex-row items-center justify-center xs:justify-between hover:bg-gray-50 transition duration-200 cursor-pointer",
                  {
                    "border-b border-slate-200": i < restaurants.length - 1,
                  }
                )}
                onClick={() => {
                  window.location.href = `/restaurants/${r.slug}`;
                }}
              >
                <div className="inline-flex flex-col xs:flex-row items-center">
                  <div
                    className={classNames(
                      "min-w-16 sm:min-w-16 md:min-w-24 flex justify-center mb-2 sm:mb-0 items-center",
                      {
                        "mb-3 xs:mb-0 text-5xl": i < 3,
                        "text-3xl font-black text-[#C5A362] text-opacity-75":
                          i >= 3,
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
                        : `${i + 1}`}
                    </span>
                    <div className="xs:hidden flex items-center ml-2">
                      <Link
                        legacyBehavior
                        href={`/restaurants/${r.slug}`}
                        passHref
                      >
                        <a className="text-xl lg:text-2xl font-bold text-teal-500 hover:text-teal-600">
                          {r.name}
                        </a>
                      </Link>
                    </div>
                  </div>
                  {console.log("img", image)}

                  {image ? (
                    <Image
                      src={image}
                      alt={`${r.name}-photo`}
                      className="h-28 w-28 min-w-28 max-w-28 object-cover object-center rounded xs:mr-3 sm:mr-4 lg:mr-8 mb-3 xs:mb-0"
                      quality={20}
                    />
                  ) : (
                    <div className="h-28 w-28 min-w-28 max-w-28 flex items-center justify-center mr-3 sm:mr-4 lg:mr-8 mb-3 xs:mb-0 rounded bg-gray-100">
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
                        <Link
                          legacyBehavior
                          href={`/restaurants/${r.slug}`}
                          passHref
                        >
                          <a className="text-xl lg:text-2xl font-bold text-teal-500 mb-2 text-left hover:text-teal-600">
                            {r.name}
                          </a>
                        </Link>
                      </div>

                      {/* <div className="-ml-1 xs:mb-2 flex items-center justify-center xs:justify-start">
                        <RatingPill
                          avgRating={r.avgRating}
                          reviewCount={r.reviewCount}
                          hideCount
                          isStar
                        />
                        <button
                          className="mx-1 underline text-gray-500"
                          onClick={() => push(`/restaurants/${r.slug}/noter`)}
                        >
                          Noter
                        </button>
                      </div> */}
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
                    <IngredientRatingPills
                      avgCheeseRating={r.avgCheeseRating}
                      avgFriesRating={r.avgFriesRating}
                      avgSauceRating={r.avgSauceRating}
                    />
                  </div>
                </div>
                <div className="flex items-center my-1">
                  {r.reviewCount > 0 && (
                    <span className="font-black text-xl text-[#C5A362] mr-1">
                      {formatRating(r.avgRating)}
                    </span>
                  )}
                  <Star
                    fill={r.reviewCount > 0 ? "#C5A362" : "white"}
                    color={r.reviewCount > 0 ? "#C5A362" : "#aaa"}
                    size={22}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};
