import { ExternalLink, MapPin, PhoneCall, X } from "react-feather";
import Map from "components/Map";
import { formatAddress } from "lib/formatAddress";
import Skeleton from "react-loading-skeleton";
import { normalizeUrl } from "../lib/normalizeUrl";
import { useTranslation } from "next-i18next";
import { formatPhoneNumber } from "react-phone-number-input";
import { Modal } from "react-responsive-modal";
import { useState, useEffect } from "react";

export const RestaurantInfo = ({
  showMap,
  restaurant,
  setShowMap,
  modalOpen,
  setModalOpen,
}) => {
  const isSkeleton = !restaurant;
  const { t } = useTranslation();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const singlePhoneNumber =
    restaurant?.succursales.length === 1
      ? restaurant.succursales[0].phoneNumber
      : null;

  const hasMultipleLocations = restaurant?.succursales?.length > 1;
  const totalLocations = restaurant?.succursales?.length || 0;
  const maxAddressesToShow = isDesktop ? 5 : 2;
  return (
    <>
      {showMap &&
        (isSkeleton ? (
          <Skeleton className="h-[200px] mb-3" />
        ) : (
          <div className="hidden sm:block border h-[200px] mb-4">
            <Map
              restaurants={[restaurant]}
              isShowPage={true}
              showCitiesNav={false}
              enableSearch={false}
            />
          </div>
        ))}

      {/* Website - Show first */}
      {isSkeleton ? (
        <Skeleton className="mb-3" width="75%" />
      ) : (
        restaurant.website && (
          <div className="flex items-center mb-4">
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

      {/* Single location */}
      {isSkeleton ? (
        <>
          <Skeleton className="my-3" width="65%" />
          <Skeleton className="mb-3" width="45%" />
        </>
      ) : !hasMultipleLocations ? (
        <>
          <div className="flex items-center mb-4">
            <MapPin className="mr-2 inline shrink-0" size={20} />
            <span>{formatAddress(restaurant, t)}</span>
          </div>
          {singlePhoneNumber && (
            <div className="mb-4 flex items-center">
              <PhoneCall className="mr-2 inline shrink-0" size={20} />
              <a href={`tel:${singlePhoneNumber}`}>
                {formatPhoneNumber(singlePhoneNumber)}
              </a>
            </div>
          )}
        </>
      ) : (
        /* Multiple locations - Show limited list with header */
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-3">
            Adresses ({totalLocations})
          </h3>
          {restaurant.succursales
            .slice(0, maxAddressesToShow)
            .map((location, index) => (
              <div key={index}>
                <div className="flex items-center mb-2">
                  <MapPin className="mr-2 inline shrink-0" size={20} />
                  <span>{formatAddress({ succursales: [location] }, t)}</span>
                </div>
                {location.phoneNumber && (
                  <div className="mb-3 flex items-center">
                    <PhoneCall className="mr-2 inline shrink-0" size={20} />
                    <a href={`tel:${location.phoneNumber}`}>
                      {formatPhoneNumber(location.phoneNumber)}
                    </a>
                  </div>
                )}
                {index < maxAddressesToShow - 1 &&
                  index < totalLocations - 1 && (
                    <div className="border-b border-gray-200 mb-3"></div>
                  )}
              </div>
            ))}
          {totalLocations > maxAddressesToShow && (
            <button
              onClick={() => setModalOpen(true)}
              className="text-sm hover:text-teal-500 underline mt-2"
            >
              Voir tout
            </button>
          )}
        </div>
      )}

      <button
        className="text-sm underline block sm:hidden cursor-pointer"
        onClick={() => setShowMap(!showMap)}
      >
        {showMap ? "Cacher" : "Voir"} la carte
      </button>

      {showMap &&
        (isSkeleton ? (
          <Skeleton className="h-[200px] mb-3" />
        ) : (
          <div className="sm:hidden border h-[200px] mt-4">
            <Map
              restaurants={[restaurant]}
              isShowPage={true}
              showCitiesNav={false}
              enableSearch={false}
            />
          </div>
        ))}

      {/* Modal for all locations */}
      <Modal
        classNames={{ overlay: "customOverlay", modal: "customModal" }}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeIcon={<X />}
        blockScroll={false}
        center
      >
        <h2 className="text-lg font-bold mb-4">
          {t("restaurants.locationModal.title", { name: restaurant?.name })}
        </h2>
        <div className="space-y-4">
          {restaurant?.succursales?.map((location, index) => (
            <div
              key={index}
              className="text-sm sm:text-base pb-4 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-center mb-2">
                <MapPin className="mr-2 inline shrink-0" size={20} />
                <span>{formatAddress({ succursales: [location] }, t)}</span>
              </div>
              {location.phoneNumber && (
                <div className="flex items-center">
                  <PhoneCall className="mr-2 inline shrink-0" size={20} />
                  <a href={`tel:${location.phoneNumber}`}>
                    {formatPhoneNumber(location.phoneNumber)}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
