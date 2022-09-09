import React, { useEffect, useRef, useState } from 'react'
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { X, MapPin } from 'react-feather'
import { useRouter } from 'next/router'
import RatingPill from 'components/RatingPill'
import { flatten, minBy, maxBy } from 'lodash'
import { ratingColors } from 'data/ratingColors'
import { round } from 'lodash'
import { useRestaurantCardHover } from './context/RestaurantCardHoverProvider'
import classNames from 'classnames'
import Image from 'next/image'
import Color from 'color'
import { Image as CloudImage } from 'components/Image'

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoibmljb2ZyYWlzc2UiLCJhIjoiY2thZzZtemk3MDE4NzJybXVtMjF5a2xyOSJ9.6JURdkZj5FnZ5lxMzPncOA'

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
  // const [showPopup, setShowPopup] = useState(false)
  const { hoveredId, setHoveredId } = useRestaurantCardHover()

  const isHovered = hoveredId === restaurant._id

  const togglePopup = () => {
    if (isPopupOpen) {
      closePopup(popupId)
    } else {
      openPopup(popupId)
    }
  }

  const theRef = useRef()

  if (theRef.current) {
    theRef.current.parentNode.style.zIndex = isHovered ? 100 : 1
  }

  const image = restaurant.reviews?.find((r) => r.photos?.[0])?.photos[0]
  return (
    <div>
      <Marker
        key={restaurant._id}
        longitude={address.center[0]}
        latitude={address.center[1]}
        anchor='bottom'
      >
        {isSmallMarker ? (
          <div
            onMouseEnter={() => !isShowPage && setHoveredId(restaurant._id)}
            onMouseLeave={() => !isShowPage && setHoveredId(null)}
            data-pin='yes'
            onClick={(e) => {
              e.stopPropagation()
              togglePopup()
            }}
            className={classNames(
              'transform -translate-y-1 z-30 w-4 h-4 rounded-full border-white shadow-md border-2',
              { 'scale-110': isHovered }
            )}
            style={{
              backgroundColor: isHovered
                ? '#4f46e5'
                : restaurant.reviewCount > 0
                ? Color(ratingColors[round(restaurant.avgRating)]).darken(0.4)
                : 'rgb(160, 160, 160)',
            }}
          ></div>
        ) : (
          <>
            <div
              className='0 w-10 h-10 absolute z-10 flex items-center justify-center'
              onMouseEnter={() => !isShowPage && setHoveredId(restaurant._id)}
              onMouseLeave={() => !isShowPage && setHoveredId(null)}
              data-pin='yes'
              onClick={(e) => {
                e.stopPropagation()
                togglePopup()
              }}
            >
              <Image
                alt='poutine-logo'
                src='/poutine1.png'
                width={26}
                height={26}
                className={classNames('transform -translate-y-1 z-30', { 'scale-110': isHovered })}
                onClick={() => {
                  togglePopup()
                }}
              />
            </div>

            <MapPin
              size={40}
              color={
                isHovered
                  ? '#4f46e5'
                  : restaurant.reviewCount > 0
                  ? Color(ratingColors[round(restaurant.avgRating)]).darken(0.4)
                  : 'rgb(205, 205, 205)'
              }
              fill={
                restaurant.reviewCount > 0
                  ? Color(ratingColors[round(restaurant.avgRating)]).saturate(0.5)
                  : 'white'
              }
              className={classNames('transition duration-100', {
                'transform scale-110': isHovered,
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
          anchor='bottom'
          offset={isSmallMarker ? 16 : 44}
          closeButton={false}
          onClose={() => closePopup(popupId)}
          closeOnClick={false}
          onOpen={() => {
            closeOtherPopups(popupId)
          }}
        >
          <div
            className={classNames('relative flex flex-col items-center z-100', {
              'w-44': !isShowPage,
              'w-36': isShowPage,
            })}
            onClick={() => !isShowPage && window.open(`/restaurants/${restaurant._id}`)}
          >
            <div className='font-bold text-base mb-1'>{restaurant.name}</div>
            {!isShowPage && (
              <RatingPill avgRating={restaurant.avgRating} reviewCount={restaurant.reviewCount} />
            )}
            {image && !isShowPage && (
              <CloudImage
                publicId={image}
                alt={`${restaurant.name}-photo`}
                className='max-h-[100px] mt-2 object-cover object-center rounded'
              />
            )}
            <div
              className={classNames('leading-3', {
                'text-[11px] mt-2': !isShowPage,
                'text-[12px]': isShowPage,
              })}
            >
              {address.place_name}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation()
                closePopup(popupId)
              }}
              className='bg-gray-400 text-white w-6 h-6 rounded-full flex items-center justify-center absolute top-[-18px] right-[-18px] border-2 border-white shadow cursor-pointer hover:bg-black'
            >
              <X size={18} />
            </div>
          </div>
        </Popup>
      )}
    </div>
  )
}

const MapMap = ({ restaurants, isShowPage }) => {
  const [userCoordinates, setUserCoordinates] = useState()
  const allCoordinates = flatten(restaurants.map((r) => r.succursales.map((s) => s.address.center)))
  const minLongitude = minBy(allCoordinates, (c) => c[0])?.[0]
  const minLatitude = minBy(allCoordinates, (c) => c[1])?.[1]
  const maxLongitude = maxBy(allCoordinates, (c) => c[0])?.[0]
  const maxLatitude = maxBy(allCoordinates, (c) => c[1])?.[1]

  const [openPopups, setOpenPopups] = useState([])
  const [userPopupOpen, setUserPopupOpen] = useState(false)

  const openPopup = (id) => {
    setOpenPopups([...openPopups, id])
  }

  const closePopup = (id) => setOpenPopups(openPopups.filter((p) => p !== id))

  const closeOtherPopups = (id) => {
    setOpenPopups([id])
  }

  const closeAllPopups = () => setOpenPopups([])

  const [isSmallMarker, setIsSmallMarker] = useState(false)

  console.log(isSmallMarker)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserCoordinates([position.coords.longitude, position.coords.latitude])
    })
  }, [])

  return (
    <div
      className='h-full'
      onClick={(e) => {
        if (e.target.dataset.pin !== 'yes') closeAllPopups()
      }}
    >
      <Map
        reuseMaps
        id='mymap'
        bounds={[
          [minLongitude, minLatitude],
          [maxLongitude, maxLatitude],
        ]}
        fitBoundsOptions={{ padding: 60, maxZoom: 13 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle='mapbox://styles/mapbox/streets-v10'
        mapboxAccessToken={MAPBOX_TOKEN}
        onZoom={(e) => setIsSmallMarker(e.viewState.zoom < 12.5)}
      >
        <NavigationControl position='bottom-right' />
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
                setUserPopupOpen(true)
                setTimeout(() => {
                  setUserPopupOpen(false)
                }, 2000)
              }}
              style={{ zIndex: 40 }}
            >
              <div className='h-8 w-8 bg-white rounded-full shadow flex items-center justify-center z-50'>
                <div className='h-5 w-5 bg-blue-500 transition animate-pulse scale-105 rounded-full '></div>
              </div>
            </Marker>
            <Marker
              longitude={userCoordinates[0]}
              latitude={userCoordinates[1]}
              style={{ zIndex: 40 }}
            >
              <div
                className={classNames(
                  'transition bg-white shadow duration-500 mt-[-38px] px-2 rounded text-gray-600',
                  {
                    'opacity-100': userPopupOpen,
                    'opacity-0': !userPopupOpen,
                  }
                )}
              >
                Vous êtes ici
              </div>
            </Marker>
          </div>
        )}
      </Map>
    </div>
  )
}

export default MapMap
