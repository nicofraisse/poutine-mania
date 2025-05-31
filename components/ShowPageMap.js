import React, { useEffect, useRef, useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { X, MapPin } from "react-feather";
import RatingPill from "components/RatingPill";
import { flatten, minBy, maxBy } from "lodash";
import { ratingColors } from "data/ratingColors";
import { useRestaurantCardHover } from "./context/RestaurantCardHoverProvider";
import classNames from "classnames";
import Image from "next/image";
import Color from "color";
import { Image as CloudImage } from "components/Image";
import { TagSection } from "./RestaurantCard";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { getMainPhoto } from "../lib/restaurantMainPhotos";

const MarkerAndPopup = ({
  restaurant,
  address,
  openPopup,
  closePopup,
  isPopupOpen,
  popupId,
  closeOtherPopups,
  isShowPage,
  isSmallMarker,
}) => {
  const { hoveredId, setHoveredId } = useRestaurantCardHover();
  const { locale } = useRouter();

  const isHovered = hoveredId === restaurant._id;

  const togglePopup = () => {
    if (isPopupOpen) {
      closePopup(popupId);
    } else {
      openPopup(popupId);
    }
  };

  const theRef = useRef();

  if (theRef.current) {
    theRef.current.parentNode.style.zIndex = isHovered ? 100 : 1;
  }

  const image = getMainPhoto(restaurant);
  return (
    <div>
      <Marker
        key={restaurant._id}
        longitude={address.center[0]}
        latitude={address.center[1]}
        anchor="bottom"
      >
        {isSmallMarker ? (
          <div
            onMouseEnter={() => !isShowPage && setHoveredId(restaurant._id)}
            onMouseLeave={() => !isShowPage && setHoveredId(null)}
            data-pin="yes"
            ref={theRef}
            onClick={(e) => {
              e.stopPropagation();
              togglePopup();
            }}
            className={classNames(
              "transform -translate-y-1 z-30 transition dutation-150 w-4 h-4 rounded-full border-white shadow-md border-2",
              { "scale-150": isHovered }
            )}
            style={{
              backgroundColor:
                restaurant.reviewCount > 0
                  ? Color(
                      ratingColors[Math.floor(restaurant.avgFinalRating)]
                    ).darken(0.4)
                  : "rgb(160, 160, 160)",
              boxShadow: isHovered ? "0px 0px 7px rgba(0, 0, 0, 0.5)" : "",
            }}
          ></div>
        ) : (
          <>
            <div
              className="w-10 h-10 absolute z-10 flex items-center justify-center"
              onMouseEnter={() => !isShowPage && setHoveredId(restaurant._id)}
              onMouseLeave={() => !isShowPage && setHoveredId(null)}
              data-pin="yes"
              onClick={(e) => {
                e.stopPropagation();
                togglePopup();
              }}
            >
              <Image
                alt="poutine-logo"
                src="/poutine1.png"
                width={36}
                height={36}
                className={classNames(
                  "transform scale-75 transition-all duration-100 -translate-y-1 z-30",
                  {
                    "scale-100": isHovered,
                  }
                )}
                onClick={() => {
                  togglePopup();
                }}
              />
            </div>

            <MapPin
              size={40}
              color={
                restaurant.reviewCount > 0
                  ? Color(ratingColors[Math.floor(restaurant.avgFinalRating)])
                      .darken(0.4)
                      .hex()
                  : "rgb(205, 205, 205)"
              }
              fill={
                restaurant.reviewCount > 0
                  ? Color(
                      ratingColors[Math.floor(restaurant.avgFinalRating)]
                    ).saturate(0.5)
                  : "white"
              }
              className={classNames("transition duration-100 nocircle", {
                "transform scale-125": isHovered,
              })}
              ref={theRef}
            />
          </>
        )}
      </Marker>
      {isPopupOpen && (
        <Popup
          longitude={address.center[0]}
          latitude={address.center[1]}
          anchor="bottom"
          offset={isSmallMarker ? 24 : 44}
          closeButton={false}
          onClose={() => closePopup(popupId)}
          closeOnClick={false}
          onOpen={() => {
            closeOtherPopups(popupId);
          }}
          className={classNames("relative flex flex-col z-100", {
            "w-80": !isShowPage,
            "w-36": isShowPage,
          })}
        >
          <div
            onClick={() =>
              !isShowPage &&
              window.open(`/${locale}/restaurants/${restaurant.slug}`)
            }
          >
            {image && !isShowPage && (
              <CloudImage
                src={image}
                alt={`${restaurant.name}-photo`}
                className="w-full h-[150px] object-cover object-center rounded mb-2"
              />
            )}
            <div
              className={classNames("font-bold", {
                "text-base mb-1": !isShowPage,
                "mb-0 text-center text-sm": isShowPage,
              })}
            >
              {restaurant.name}
            </div>
            <div
              className="text-slate-600 mt-1"
              style={{ fontSize: 11, lineHeight: 1.25 }}
            >
              {address.place_name?.replace(", Canada", "")}
            </div>
            {!isShowPage && (
              <>
                <div className="max-w-28">
                  <RatingPill
                    avgRating={restaurant.avgFinalRating}
                    reviewCount={restaurant.reviewCount}
                  />
                </div>

                <div className="mt-3">
                  <TagSection
                    succursales={restaurant.succursales}
                    categories={restaurant.categories}
                    city={
                      address.context?.find((el) => el.id?.includes("place"))
                        ?.text
                    }
                    priceRange={restaurant.priceRange}
                    smallText
                    address={address.place_name}
                  />
                </div>
              </>
            )}

            <div
              onClick={(e) => {
                e.stopPropagation();
                closePopup(popupId);
              }}
              className="bg-gray-400 text-white w-6 h-6 rounded-full flex items-center justify-center absolute top-[-12px] right-[-12px] border-2 border-white shadow cursor-pointer hover:bg-black"
            >
              <X size={18} />
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

const MapMap = ({ restaurants, isShowPage }) => {
  const [userCoordinates, setUserCoordinates] = useState();
  const { t } = useTranslation();
  const allCoordinates = flatten(
    restaurants.map((r) => r.succursales.map((s) => s.address.center))
  );
  const minLongitude = minBy(allCoordinates, (c) => c[0])?.[0];
  const minLatitude = minBy(allCoordinates, (c) => c[1])?.[1];
  const maxLongitude = maxBy(allCoordinates, (c) => c[0])?.[0];
  const maxLatitude = maxBy(allCoordinates, (c) => c[1])?.[1];

  const [openPopups, setOpenPopups] = useState([]);
  const [userPopupOpen, setUserPopupOpen] = useState(false);

  const openPopup = (id) => {
    setOpenPopups([...openPopups, id]);
  };

  const closePopup = (id) => setOpenPopups(openPopups.filter((p) => p !== id));

  const closeOtherPopups = (id) => {
    setOpenPopups([id]);
  };

  const closeAllPopups = () => setOpenPopups([]);

  const [isSmallMarker, setIsSmallMarker] = useState(!isShowPage);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserCoordinates([position.coords.longitude, position.coords.latitude]);
    });
  }, []);

  return (
    <div
      className="h-full"
      onClick={(e) => {
        if (e.target.dataset.pin !== "yes") closeAllPopups();
      }}
    >
      <Map
        reuseMaps
        id="mymap2"
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        mapboxAccessToken={process.env.MAPBOX_API_KEY}
        onZoom={(e) => {
          if (!isShowPage) setIsSmallMarker(e.viewState.zoom < 12);
        }}
        initialViewState={{
          bounds: [
            [minLongitude, minLatitude],
            [maxLongitude, maxLatitude],
          ],
          fitBoundsOptions: { padding: 60, maxZoom: 13 },
        }}
      >
        <NavigationControl position="bottom-right" />
        {restaurants.map((restaurant, parentIndex) =>
          restaurant?.succursales?.map(({ address }, index) => (
            <MarkerAndPopup
              key={`${restaurant._id}-${address.place_name}`}
              restaurant={restaurant}
              address={address}
              isShowPage={isShowPage}
              openPopup={openPopup}
              closePopup={closePopup}
              popupId={`${parentIndex}-${index}`}
              isPopupOpen={openPopups.includes(`${parentIndex}-${index}`)}
              closeOtherPopups={closeOtherPopups}
              closeAllPopups={closeAllPopups}
              isSmallMarker={isSmallMarker}
            />
          ))
        )}
        {userCoordinates && (
          <div>
            <Marker
              longitude={userCoordinates[0]}
              latitude={userCoordinates[1]}
              onClick={() => {
                setUserPopupOpen(true);
                setTimeout(() => {
                  setUserPopupOpen(false);
                }, 2000);
              }}
              style={{ zIndex: 40 }}
            >
              <div className="h-8 w-8 bg-white rounded-full shadow flex items-center justify-center z-50">
                <div className="h-5 w-5 bg-blue-500 transition animate-pulse scale-105 rounded-full "></div>
              </div>
            </Marker>
            <Marker
              longitude={userCoordinates[0]}
              latitude={userCoordinates[1]}
              style={{ zIndex: 40 }}
            >
              <div
                className={classNames(
                  "transition bg-white shadow duration-500 mt-[-38px] px-2 rounded text-gray-600",
                  {
                    "opacity-100": userPopupOpen,
                    "opacity-0": !userPopupOpen,
                  }
                )}
              >
                {t("map.youAreHere")}
              </div>
            </Marker>
          </div>
        )}
      </Map>
    </div>
  );
};

export default MapMap;
