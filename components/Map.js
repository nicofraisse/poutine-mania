import React, { useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { X, MapPin } from 'react-feather'
import { useRouter } from 'next/router'
import RatingPill from 'components/RatingPill'
import { flatten, minBy, maxBy } from 'lodash'
import { ratingColors } from 'data/ratingColors'
import { round } from 'lodash'
import { useRestaurantCardHover } from './context/RestaurantCardHoverProvider'
import classNames from 'classnames'

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

  return (
    <div>
      <Marker
        key={restaurant._id}
        longitude={address.value.center[0]}
        latitude={address.value.center[1]}
        anchor='bottom'
        onClick={togglePopup}
      >
        <div
          className='0 w-10 h-10 absolute z-10'
          onMouseEnter={() => !isShowPage && setHoveredId(restaurant._id)}
          onMouseLeave={() => !isShowPage && setHoveredId(null)}
          data-pin='yes'
        ></div>
        <MapPin
          size={40}
          color={isHovered ? '#4f46e5' : '#666'}
          fill={
            isHovered
              ? '#a5b4fc'
              : restaurant.reviewCount > 0
              ? ratingColors[round(restaurant.avgRating)]
              : '#bbb'
          }
          className={classNames('transition duration-100', { 'transform scale-110': isHovered })}
        />
      </Marker>
      {isPopupOpen && (
        <Popup
          longitude={address.value.center[0]}
          latitude={address.value.center[1]}
          anchor='bottom'
          offset={44}
          closeButton={false}
          onClose={() => closePopup(popupId)}
          closeOnClick={false}
          onOpen={() => {
            closeOtherPopups(popupId)
          }}
        >
          <div
            className='relative w-36 flex flex-col items-center'
            onClick={() => window.open(`/restaurants/${restaurant._id}`)}
          >
            <div className='font-bold text-base mb-1'>{restaurant.name}</div>
            {!isShowPage && (
              <RatingPill avgRating={restaurant.avgRating} reviewCount={restaurant.reviewCount} />
            )}
            <div className='text-xs mt-2'>{address.label}</div>
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
  const allCoordinates = flatten(
    restaurants.map((r) => r.succursales.map((s) => s.address.value.center))
  )
  const minLongitude = minBy(allCoordinates, (c) => c[0])?.[0]
  const minLatitude = minBy(allCoordinates, (c) => c[1])?.[1]
  const maxLongitude = maxBy(allCoordinates, (c) => c[0])?.[0]
  const maxLatitude = maxBy(allCoordinates, (c) => c[1])?.[1]

  const [openPopups, setOpenPopups] = useState([])

  const openPopup = (id) => {
    setOpenPopups([...openPopups, id])
  }

  const closePopup = (id) => setOpenPopups(openPopups.filter((p) => p !== id))

  const closeOtherPopups = (id) => {
    setOpenPopups([id])
  }

  const closeAllPopups = () => setOpenPopups([])

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
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {restaurants.map((restaurant, parentIndex) =>
          restaurant?.addresses?.map((address, index) => (
            <MarkerAndPopup
              key={`${restaurant.id}-${address.label}`}
              restaurant={restaurant}
              address={address}
              isShowPage={isShowPage}
              openPopup={openPopup}
              closePopup={closePopup}
              popupId={`${parentIndex}-${index}`}
              isPopupOpen={openPopups.includes(`${parentIndex}-${index}`)}
              closeOtherPopups={closeOtherPopups}
              closeAllPopups={closeAllPopups}
            />
          ))
        )}
      </Map>
    </div>
  )
}

export default MapMap
