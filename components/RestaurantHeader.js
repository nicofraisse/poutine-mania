import React from "react";
import { Image as ImageIcon } from "react-feather";
import { flatten } from "lodash";
import { Image } from "./Image";
import { TagSection } from "./RestaurantCard";

const RestaurantHeader = ({ restaurant }) => {
  const city =
    restaurant.succursales[0].address?.context?.find((el) =>
      el.id?.includes("neighborhood")
    )?.text ||
    restaurant.succursales[0].address?.context?.find((el) =>
      el.id?.includes("place")
    )?.text ||
    restaurant.succursales[0].address?.context?.find((el) =>
      el.id?.includes("country")
    )?.text;

  const images = flatten(restaurant.reviews.map((r) => r.photos)).filter(
    Boolean
  );

  return (
    <div className="relative  h-1/2vw sm:h-1/3vw lg:h-1/5vw 2xl:h-1/6vw">
      <div className="flex w-full h-full">
        <div className="w-1/2 sm:w-1/3 bg-gray-100 flex items-center justify-center">
          {images[0] ? (
            <Image
              src={images[0]}
              className="w-full h-full object-cover object-center"
              alt="restaurant-main-image-1"
            />
          ) : (
            <ImageIcon className="text-gray-300" size="80" alt="default" />
          )}
        </div>
        <div className="w-1/2 sm:w-1/3 bg-gray-100 flex items-center justify-center">
          {images[1] ? (
            <Image
              src={images[1]}
              className="w-full h-full object-cover object-center"
              alt="restaurant-main-image-2"
            />
          ) : (
            <ImageIcon className="text-gray-300" size="80" alt="default" />
          )}
        </div>
        <div className="hidden sm:w-1/3 bg-gray-100 sm:flex items-center justify-center">
          {images[2] ? (
            <Image
              src={images[2]}
              className="w-full h-full object-cover object-center"
              alt="restaurant-main-image-3"
            />
          ) : (
            <ImageIcon className="text-gray-300" size="80" alt="default" />
          )}{" "}
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#000000bb] flex items-end text-center">
        <div className="pl-4 pb-3 md:pl-7 md:pb-4 w-full">
          <div className="flex justify-between items-center text-white">
            <h1
              className="text-2xl md:text-3xl xl:text-5xl font-bold text-white"
              style={{ textShadow: "0px 2px 10px rgba(0, 0, 0, 0.5)" }}
            >
              {restaurant.name}
            </h1>
          </div>
          <div className="mt-1 xl:mt-2">
            {/* <span className='mr-1'>
              {`${restaurant.categories[0]} à ${city} •`}{' '}
              {restaurant.priceRange && `${repeat('$', restaurant.priceRange)}	• `}
            </span> */}
            {/* <RatingPill avgRating={restaurant.avgRating} isNew isDarkBackground /> */}
            <div className="text-left mb-1 mt-1">
              <TagSection
                succursales={restaurant.succursales}
                categories={restaurant.categories}
                city={city}
                priceRange={restaurant.priceRange}
                darkBackground
                largeText
                noAddress
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
