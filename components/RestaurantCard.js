import RatingPill from "components/RatingPill";
import { MapPin } from "react-feather";
import { repeat } from "lodash";
import { useRestaurantCardHover } from "./context/RestaurantCardHoverProvider";
import classNames from "classnames";
import { Image } from "./Image";
import Link from "next/link";
import { useRateRestaurant } from "./context/RateRestaurantProvider";
import Skeleton from "react-loading-skeleton";

const RestaurantCard = ({ restaurant }) => {
  const loading = Object.keys(restaurant).length === 0;
  const { setHoveredId, hoveredId } = useRestaurantCardHover();
  const { rateRestaurant } = useRateRestaurant();

  const city =
    restaurant.succursales &&
    (restaurant.succursales[0].address?.context?.find((el) =>
      el.id?.includes(
        restaurant.succursales.length === 1 ? "neighborhood" : "place"
      )
    )?.text ||
      restaurant.succursales[0].address?.context?.find((el) =>
        el.id?.includes("region")
      )?.text);

  const image = restaurant.reviews?.find((r) => r.photos?.[0])?.photos[0];

  return (
    <div>
      <Link legacyBehavior href={`/restaurants/${restaurant?.slug}`} passHref>
        <div
          className={classNames(
            "group py-3 px-2 lg:px-3 flex justify-between transition duration-100 xs:rounded-md",
            {
              "cursor-pointer": !loading,
              "bg-[#fefefe] shadow": !loading && hoveredId !== restaurant?._id,
              "bg-none shadow-none": loading,
              "bg-white shadow-md transform -translate-y-[2px]":
                !loading && hoveredId === restaurant?._id,
            }
          )}
          onMouseEnter={
            setHoveredId ? () => setHoveredId(restaurant?._id) : null
          }
          onMouseLeave={setHoveredId ? () => setHoveredId(null) : null}
        >
          <div
            className={classNames(
              "rounded h-28 sm:h-28 sm:min-w-28 mr-2 lg:mr-3",
              { "flex items-center justify-center": !loading }
            )}
            style={{ minWidth: "29%" }}
          >
            {image ? (
              <Image
                src={image}
                alt={`${restaurant.name}-photo`}
                className="w-full h-full object-cover object-center rounded"
              />
            ) : loading ? (
              <Skeleton className="h-full relative bottom-1" height="100%" />
            ) : (
              <div className="bg-gray-100 w-full h-full flex items-center justify-center rounded">
                <Image
                  forceNextImage
                  src="/poutinebw.png"
                  width={64}
                  height={64}
                  alt="empty-poutine"
                  className="opacity-30"
                />
              </div>
            )}
          </div>

          <div style={{ minWidth: "71%" }}>
            <h2
              className={classNames(
                "font-semibold text-base lg:text-lg text-teal-600 group-hover:text-teal-500 transition duration-100",
                { "-mt-1": loading }
              )}
            >
              {restaurant?.name || <Skeleton width="50%" />}
            </h2>

            {loading ? (
              <Skeleton width="82%" />
            ) : (
              <div className="mb-2 mt-1">
                <RatingPill
                  avgRating={restaurant.avgFinalRating || restaurant.avgRating}
                  reviewCount={restaurant.reviewCount}
                  isNew
                  onRate={() => rateRestaurant(restaurant)}
                />
              </div>
            )}

            {loading ? (
              <>
                <Skeleton width="60%" />
                <Skeleton width="70%" />
              </>
            ) : (
              <TagSection
                succursales={restaurant.succursales}
                categories={restaurant.categories}
                city={city}
                priceRange={restaurant.priceRange}
              />
            )}
            {/* <LastComment comment={lastComment} /> */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export const TagSection = ({
  priceRange,
  categories,
  city,
  succursales,
  smallText,
  address,
  largeText,
  darkBackground,
  noAddress,
}) => {
  return (
    <>
      <div
        className={classNames("text-ellipsis", {
          "text-xs": smallText,
          "text-sm font-light": !smallText && !largeText,
          "text-sm sm:text-md font-light": largeText,
          "text-gray-500": !darkBackground,
          "text-white": darkBackground,
        })}
      >
        <span className="bg-gray-600 px-1 rounded text-white">
          {priceRange && `${repeat("$", priceRange)}`}
        </span>{" "}
        •{" "}
        {categories?.map((c, i) => (
          <span key={i} className="">
            {c}
            {i === categories.length - 1 ? " • " : "/"}
          </span>
        )) || <Skeleton />}
        <span className="">{city}</span>
      </div>
      {!noAddress && (
        <div
          className={classNames("text-xs", {
            "mt-1 text-xs": smallText,
            "mt-2 text-xs": !smallText && !largeText,
            "mt-2 text-sm": largeText,
            "text-gray-400": !darkBackground,
            "text-white": darkBackground,
          })}
        >
          <MapPin size={15} className="inline mt-[-2px]" />{" "}
          {address ||
            (succursales &&
              (succursales.length === 1
                ? succursales[0].address.place_name.split(", Q")[0]
                : `${succursales.length} adresses au Québec`))}
        </div>
      )}
    </>
  );
};

export default RestaurantCard;
