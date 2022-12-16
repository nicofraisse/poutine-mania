import { ExternalLink, MapPin, Phone, PhoneCall } from "react-feather";
import Map from "components/Map";
import { formatAddress } from "lib/formatAddress";

export const RestaurantInfo = ({ showMap, restaurant, setShowMap }) => {
  return (
    <>
      {showMap && (
        <div className="border h-[200px] mb-4 ">
          <Map restaurants={[restaurant]} isShowPage />
        </div>
      )}

      <div className="flex items-center mb-4">
        <MapPin className="mr-2 inline shrink-0" size={20} />
        <span>{formatAddress(restaurant)}</span>
      </div>
      {restaurant.phoneNumber && (
        <div className="mb-4 flex items-center">
          <PhoneCall className="mr-2 inline shrink-0" size={20} />
          <span>{restaurant.phoneNumber}</span>
        </div>
      )}
      {restaurant.website && (
        <div className="flex items-center">
          <ExternalLink className="mr-2 inline shrink-0" size={20} />
          <a
            target="_blank"
            href={restaurant.website}
            className="underline text-ellipsis whitespace-nowrap overflow-hidden"
            rel="noreferrer"
          >
            {restaurant.website}
          </a>
        </div>
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
