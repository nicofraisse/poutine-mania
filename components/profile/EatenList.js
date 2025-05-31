import React from "react";
import { useGet } from "../../lib/useAxios";
import { Spinner } from "components/Spinner";
import Link from "next/link";
import { Image } from "../../components/Image";
import { MessageCircle } from "react-feather";
import Color from "color";
import { ratingColors } from "../../data/ratingColors";
import { formatRating } from "../../lib/formatRating";
import Button from "../../components/Button";
import { formatDateAgo } from "../../lib/formatDateAgo";
import { flatten } from "lodash";

const EatenList = ({ userId }) => {
  const { data: restaurants } = useGet(`/api/users/${userId}/get-eatenlist`, {
    skip: !userId,
  });

  return (
    <div className="">
      <div className="p-4 bg-white rounded border">
        {!restaurants ? (
          <Spinner />
        ) : (
          ["first", ...restaurants].map((r, i) => {
            if (r === "first") {
              return (
                <div
                  key={i}
                  className="flex justify-between text-stone-600 p-2"
                >
                  {/* <div>Classement</div>
                  <div>Poutine</div>
                  <div>Note</div> */}
                </div>
              );
            }
            return (
              <div key={r._id} className="pt-5 rounded mb-2 flex items-start">
                {/* <div className="bg-gray-100 rounded-sm h-12 w-12 sm:h-16 sm:w-16 mr-2 lg:mr-3 flex items-center justify-center ">
                  {r.mainPhotos?.length > 0 ? (
                    <Image
                      src={r.mainPhotos[0]}
                      alt={`${r.name}-photo`}
                      className="h-12 w-12 sm:h-16 sm:w-16 object-cover object-center rounded-sm"
                    />
                  ) : (
                    <ImageIcon
                      className="text-gray-300"
                      size={48}
                      alt="placeholder"
                    />
                  )}
                </div> */}
                <div className="text-5xl text-stone-300 mr-6 font-bold">
                  {i}
                </div>
                <div className="flex-grow relative">
                  <div className="flex justify-between">
                    <Link
                      legacyBehavior
                      href={`/restaurants/${r.slug}`}
                      passHref
                    >
                      <a rel="noopener noreferrer">
                        <div className="font-bold text-base lg:text-lg text-teal-600 hover:underline">
                          {r.name}
                        </div>
                      </a>
                    </Link>
                    <div className="h-[1px] bg-slate-200 mt-[14px] ml-4 mr-2 flex-grow"></div>
                    <div className="mb-2 ml-4">
                      {r.reviews.length > 0 ? (
                        <span
                          className="py-[0px] px-[12px] rounded text-xl text-white flex items-center"
                          style={{
                            backgroundColor: Color(ratingColors[Math.floor(7)])
                              .darken(0.4)
                              .desaturate(0.3),
                          }}
                        >
                          {formatRating(r.reviews[0].finalRating)}
                          <span className="text-white font-normal text-xs text-opacity-80 ml-[2px] -mb-[2px]">
                            /10
                          </span>
                        </span>
                      ) : (
                        <Link
                          legacyBehavior
                          href={`/restaurants/${r.slug}/noter`}
                          passHref
                        >
                          <Button
                            height="xs"
                            className="text-normal"
                            variant="light"
                          >
                            Noter
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                  {/* <TagSection
                    priceRange={r.priceRange}
                    categories={r.categories}
                    // succursales={r.succursales}
                    city={
                      r.succursales[0].address?.context?.find((el) =>
                        el.id?.includes("neighborhood")
                      )?.text
                    }
                    noAddress
                  /> */}

                  <p className="" style={{ lineHeight: 1.4 }}>
                    <MessageCircle
                      className="inline text-stone-500 mr-1"
                      size={18}
                    />
                    <span className="text-sm text-stone-500 inline">
                      {r.reviews.length > 0 &&
                      r.reviews.find((rev) => rev.comment) ? (
                        <>
                          {r.reviews.find((rev) => rev.comment).comment}
                          <span className="text-stone-400 text-xs">
                            {" "}
                            - le{" "}
                            {formatDateAgo(
                              r.reviews.find((rev) => rev.comment).createdAt,
                              "dd/MM/yyyy"
                            )}
                          </span>
                        </>
                      ) : (
                        "Pas de commentaire"
                      )}
                    </span>
                  </p>
                  <div className="flex overflow-x-auto w-[548px] scrollbar-hide">
                    {flatten(r.reviews?.map((r) => r.photos))
                      .filter(Boolean)
                      .filter((i) => i !== "null")
                      .map((photo) => {
                        return (
                          <Image
                            key={photo}
                            src={photo}
                            alt="poutine-user-photo"
                            className="rounded mr-3 mt-3 max-h-[140px] max-w-[240px] object-cover"
                          />
                        );
                      })}
                    <div className="min-w-[50px]"></div>
                    {flatten(r.reviews?.map((r) => r.photos)).filter(Boolean)
                      .length > 0 && (
                      <div className="absolute h-[140px] bottom-0 right-[1px] w-[50px] bg-gradient-to-r from-transparent to-white"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export { EatenList };
