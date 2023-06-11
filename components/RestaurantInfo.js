import { ExternalLink, MapPin, PhoneCall } from "react-feather";
import ShowPageMap from "components/ShowPageMap";
import { formatAddress } from "lib/formatAddress";
import Skeleton from "react-loading-skeleton";

export const RestaurantInfo = ({ showMap, restaurant, setShowMap }) => {
  const isSkeleton = !restaurant;
  return (
    <>
      {showMap &&
        (isSkeleton ? (
          <Skeleton className="h-[200px] mb-3" />
        ) : (
          <div className="border h-[200px] mb-4">
            <ShowPageMap restaurants={[restaurant]} isShowPage />
          </div>
        ))}

      {isSkeleton ? (
        <Skeleton className="my-3" width="65%" />
      ) : (
        <div className="flex items-center mb-4">
          <>
            <MapPin className="mr-2 inline shrink-0" size={20} />
            <span>{formatAddress(restaurant)}</span>
          </>
        </div>
      )}
      {isSkeleton ? (
        <Skeleton className="mb-3" width="45%" />
      ) : (
        restaurant.phoneNumber && (
          <div className="mb-4 flex items-center">
            <PhoneCall className="mr-2 inline shrink-0" size={20} />
            <span>{restaurant.phoneNumber}</span>
          </div>
        )
      )}
      {isSkeleton ? (
        <Skeleton className="mb-3" width="75%" />
      ) : (
        restaurant.website && (
          <div className="flex items-center ">
            <ExternalLink className="mr-2 inline shrink-0" size={20} />
            <a
              target="_blank"
              href={restaurant.website}
              className="underline"
              rel="noreferrer"
            >
              {restaurant.website}
            </a>
          </div>
        )
      )}

      <div
        className="underline block sm:hidden cursor-pointer"
        onClick={() => setShowMap(!showMap)}
      >
        {showMap ? "Cacher" : "Voir sur"} la carte
      </div>
    </>
  );
};
