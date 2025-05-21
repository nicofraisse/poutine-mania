import React, { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { X, MapPin } from "react-feather";
import { useRouter } from "next/router";
import RatingPill from "components/RatingPill";
import { flatten, minBy, maxBy } from "lodash";
import { ratingColors } from "data/ratingColors";
import { useRestaurantCardHover } from "./context/RestaurantCardHoverProvider";
import classNames from "classnames";
import Image from "next/image";
import Color from "color";
import { Image as CloudImage } from "components/Image";
import { TagSection } from "./RestaurantCard";
import { useRestaurantSearch } from "components/context/RestaurantSearchProvider";
import { useTranslation } from "next-i18next";

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
  mapRef,
  viewState,
}) => {
  const { hoveredId } = useRestaurantCardHover();
  const { locale } = useRouter();

  const isHovered = hoveredId === restaurant._id;

  const togglePopup = () => {
    if (isPopupOpen) {
      closePopup(popupId);
    } else {
      openPopup(popupId);
      mapRef.current.flyTo({
        center: [address.center[0], address.center[1]],
        zoom: viewState.zoom,
        duration: 1000,
      });
    }
  };

  const theRef = useRef();

  if (theRef.current) {
    theRef.current.parentNode.style.zIndex = isHovered ? 100 : 1;
  }

  const image = restaurant.reviews?.find((r) => r.photos?.[0])?.photos[0];
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
            // onMouseEnter={() => !isShowPage && setHoveredId(restaurant._id)}
            // onMouseLeave={() => !isShowPage && setHoveredId(null)}
            data-pin="yes"
            ref={theRef}
            onClick={(e) => {
              e.stopPropagation();
              togglePopup();
            }}
            className={classNames(
              "transform -translate-y-1 z-30 hover:scale-150 hover:shadow-md transition dutation-150 w-4 h-4 rounded-full border-white shadow-md border-2",
              { "scale-150 shadow-md": isHovered }
            )}
            style={{
              backgroundColor:
                restaurant.reviewCount > 0
                  ? Color(
                      ratingColors[Math.floor(restaurant.avgRating)]
                    ).darken(0.4)
                  : "rgb(160, 160, 160)",
              // boxShadow: isHovered ? "0px 0px 7px rgba(0, 0, 0, 0.5)" : "",
            }}
          ></div>
        ) : (
          <div
            className={classNames(
              "transition-transform duration-200 transform hover:scale-125",
              {
                "scale-125": isHovered,
              }
            )}
          >
            <div
              className="w-10 h-10 absolute z-10 flex items-center justify-center "
              // onMouseEnter={() => !isShowPage && setHoveredId(restaurant._id)}
              // onMouseLeave={() => !isShowPage && setHoveredId(null)}
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
                  "transform scale-75 transition-all duration-100 -translate-y-1 z-30"
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
                  ? Color(ratingColors[Math.floor(restaurant.avgRating)])
                      .darken(0.4)
                      .hex()
                  : "rgb(205, 205, 205)"
              }
              fill={
                restaurant.reviewCount > 0
                  ? Color(
                      ratingColors[Math.floor(restaurant.avgRating)]
                    ).saturate(0.5)
                  : "white"
              }
              className={"nocircle"}
              ref={theRef}
            />
          </div>
        )}
      </Marker>
      {isPopupOpen && (
        <Popup
          longitude={address.center[0]}
          latitude={address.center[1]}
          dynamicPosition={true}
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
            {!isShowPage && (
              <>
                <div className="max-w-28">
                  <RatingPill
                    avgRating={restaurant.avgRating}
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
  const { query } = useRouter();
  const { t } = useTranslation();

  const DEFAULT_COORDINATES = useMemo(() => {
    return {
      latitude: 45.53,
      longitude: -73.69,
      zoom: 10,
    };
  }, []);
  const { searchValue } = useRestaurantSearch();

  const [viewState, setViewState] = useState(DEFAULT_COORDINATES);

  useEffect(() => {
    if (restaurants) {
      const allCoordinates = flatten(
        restaurants.map((r) => r.succursales.map((s) => s.address.center))
      );
      const minLongitude = minBy(allCoordinates, (c) => c[0])?.[0];
      const minLatitude = minBy(allCoordinates, (c) => c[1])?.[1];
      const maxLongitude = maxBy(allCoordinates, (c) => c[0])?.[0];
      const maxLatitude = maxBy(allCoordinates, (c) => c[1])?.[1];

      if (restaurants.length > 0) {
        if (query.search && query.search === searchValue) {
          mapRef.current?.fitBounds(
            [
              [minLongitude, minLatitude],
              [maxLongitude, maxLatitude],
            ],
            { padding: 50, duration: 1000, maxZoom: 17.5 }
          );
        } else {
          mapRef.current?.flyTo({
            center: [
              DEFAULT_COORDINATES.longitude,
              DEFAULT_COORDINATES.latitude,
            ],
            zoom: DEFAULT_COORDINATES.zoom,
            duration: 2000,
          });
        }
      }
    }
  }, [restaurants, query.search, searchValue, DEFAULT_COORDINATES]);

  const [openPopups, setOpenPopups] = useState([]);
  const [userPopupOpen, setUserPopupOpen] = useState(false);

  const POUTINE_LOGO_ZOOM_THRESHOLD = 12;

  const mapRef = useRef();

  const openPopup = (id) => {
    setOpenPopups([...openPopups, id]);
  };

  const closePopup = (id) => setOpenPopups(openPopups.filter((p) => p !== id));

  const closeOtherPopups = (id) => {
    setOpenPopups([id]);
  };

  const closeAllPopups = () => setOpenPopups([]);

  const [isSmallMarker, setIsSmallMarker] = useState(
    viewState.zoom < POUTINE_LOGO_ZOOM_THRESHOLD
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoordinates([
          position.coords.longitude,
          position.coords.latitude,
        ]);
        // setViewState({
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        //   zoom: 12.1,
        // });
      },
      (err) => console.error("position error", err),
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, []);

  const handleLocationButtonClick = (location) => {
    const locations = {
      Montreal: {
        latitude: 45.53,
        longitude: -73.61,
        zoom: 10,
      },
      QuebecCity: {
        longitude: -71.23225932890741,
        latitude: 46.837649627704205,
        zoom: 9.997052251475678,
      },
      QuebecRegion: {
        longitude: -72.65,
        latitude: 47.28,
        zoom: 5.254900910397835,
      },
    };

    const locationCoordinates = locations[location];

    if (mapRef.current) {
      mapRef.current.getMap().flyTo({
        center: [locationCoordinates.longitude, locationCoordinates.latitude],
        zoom: locationCoordinates.zoom,
        duration: 2000,
      });
    }
  };

  return (
    <div
      className={classNames("h-full", {
        "animate-pulse": !restaurants,
      })}
      onClick={(e) => {
        if (e.target.dataset.pin !== "yes") closeAllPopups();
      }}
    >
      <Map
        ref={mapRef}
        reuseMaps
        id="mymap"
        fadeDuration={1000}
        onMove={(evt) => setViewState(evt.viewState)}
        maxZoom={20}
        // initialViewState={{
        //   bounds: [
        //     [minLongitude, minLatitude],
        //     [maxLongitude, maxLatitude],
        //   ],
        //   fitBoundsOptions: { padding: 60, maxZoom: 13 },
        // }}
        {...viewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        mapboxAccessToken={process.env.MAPBOX_API_KEY}
        onZoom={(e) => {
          if (!isShowPage)
            setIsSmallMarker(e.viewState.zoom < POUTINE_LOGO_ZOOM_THRESHOLD);
        }}
      >
        <div className="absolute top-0 left-0 m-4 z-20">
          <button
            className="bg-teal-500 hover:bg-teal-700 mr-1 text-white font-bold py-2 px-4 rounded mb-2"
            onClick={() => handleLocationButtonClick("Montreal")}
          >
            {t("map.place.montreal")}
          </button>
          <button
            className="bg-cyan-500 hover:bg-cyan-700 mr-1 text-white font-bold py-2 px-4 rounded mb-2"
            onClick={() => handleLocationButtonClick("QuebecCity")}
          >
            {t("map.place.quebecCity")}
          </button>
          <button
            className="bg-stone-500 hover:bg-stone-700 mr-1 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLocationButtonClick("QuebecRegion")}
          >
            {t("map.place.quebecRegion")}
          </button>
        </div>

        <NavigationControl position="bottom-right" />
        {restaurants?.map((restaurant, parentIndex) =>
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
              mapRef={mapRef}
              viewState={viewState}
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
