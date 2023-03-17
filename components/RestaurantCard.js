import RatingPill from "components/RatingPill";
import { Image as ImageIcon, MapPin } from "react-feather";
import { repeat } from "lodash";
import { useRestaurantCardHover } from "./context/RestaurantCardHoverProvider";
import classNames from "classnames";
import { Image } from "./Image";
import Link from "next/link";
import { useRateRestaurant } from "./context/RateRestaurantProvider";

const RestaurantCard = ({ restaurant }) => {
  const {
    avgRating,
    name,
    reviewCount,
    succursales,
    reviews,
    categories,
    priceRange,
  } = restaurant;
  const { setHoveredId, hoveredId } = useRestaurantCardHover();
  const { rateRestaurant } = useRateRestaurant();

  const city =
    succursales[0].address?.context?.find((el) =>
      el.id?.includes(succursales.length === 1 ? "neighborhood" : "place")
    )?.text ||
    succursales[0].address?.context?.find((el) => el.id?.includes("region"))
      ?.text;

  const image = reviews?.find((r) => r.photos?.[0])?.photos[0];

  return (
    <div className="my-2 mx-3">
      <Link href={`/restaurants/${restaurant._id}`} passHref>
        <div
          className={classNames(
            "group py-3 px-2 lg:px-3 flex justify-between items-start transition duration-100 rounded-md mr-2 cursor-pointer",
            {
              "bg-[#fefefe] shadow": hoveredId !== restaurant._id,
              "bg-white shadow-md transform -translate-y-[2px]":
                hoveredId === restaurant._id,
            }
          )}
          onMouseEnter={
            setHoveredId ? () => setHoveredId(restaurant._id) : null
          }
          onMouseLeave={setHoveredId ? () => setHoveredId(null) : null}
        >
          <div
            className="bg-gray-100 rounded-md w-1/4 h-24 min-w-24 sm:h-28 sm:min-w-28 mr-2 lg:mr-3 flex items-center justify-center "
            style={{ minWidth: "29%" }}
          >
            {image ? (
              <Image
                src={image}
                alt={`${name}-photo`}
                className="h-24 min-w-24 sm:h-28 sm:min-w-28 object-cover object-center rounded-md"
              />
            ) : (
              <ImageIcon
                className="text-gray-300"
                size={48}
                alt="placeholder"
              />
            )}
          </div>

          <div style={{ minWidth: "71%" }}>
            <div className="font-bold text-base lg:text-lg text-teal-600 group-hover:text-teal-500 transition duration-100">
              {name}
            </div>

            <div className="mb-2 mt-1">
              <RatingPill
                avgRating={avgRating}
                reviewCount={reviewCount}
                isNew
                onRate={() => rateRestaurant(restaurant)}
              />
            </div>

            <TagSection
              succursales={succursales}
              categories={categories}
              city={city}
              priceRange={priceRange}
            />
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
        {categories.map((c, i) => (
          <span key={i} className="">
            {c}
            {i === categories.length - 1 ? " • " : "/"}
          </span>
        ))}
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
            (succursales.length === 1
              ? succursales[0].address.place_name.split(", Q")[0]
              : `${succursales.length} adresses au Québec`)}
        </div>
      )}
    </>
  );
};

export default RestaurantCard;
