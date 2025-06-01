import { ExternalLink, MapPin, PhoneCall } from "react-feather";
import Map from "components/Map";
import { formatAddress } from "lib/formatAddress";
import Skeleton from "react-loading-skeleton";
import { normalizeUrl } from "../lib/normalizeUrl";
import { useTranslation } from "next-i18next";

export const RestaurantInfo = ({ showMap, restaurant, setShowMap }) => {
  const isSkeleton = !restaurant;
  const { t } = useTranslation();
  return (
    <>
      {showMap &&
        (isSkeleton ? (
          <Skeleton className="h-[200px] mb-3" />
        ) : (
          <div className="border h-[200px] mb-4">
            <Map
              restaurants={[restaurant]}
              isShowPage={true}
              showCitiesNav={false}
              enableSearch={false}
            />
          </div>
        ))}

      {isSkeleton ? (
        <Skeleton className="my-3" width="65%" />
      ) : (
        <div className="flex items-center mb-4">
          <>
            <MapPin className="mr-2 inline shrink-0" size={20} />
            <span>{formatAddress(restaurant, t)}</span>
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
              href={normalizeUrl(restaurant.website)}
              className="underline"
              rel="noreferrer"
            >
              {normalizeUrl(restaurant.website)}
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
