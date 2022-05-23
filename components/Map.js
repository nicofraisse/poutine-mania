import React, { useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { X } from 'react-feather'
import { useRouter } from 'next/router'
import RatingPill from 'components/RatingPill'
import { flatten, minBy, maxBy } from 'lodash'
import { ratingColors } from 'data/ratingColors'
import { round } from 'lodash'

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoibmljb2ZyYWlzc2UiLCJhIjoiY2thZzZtemk3MDE4NzJybXVtMjF5a2xyOSJ9.6JURdkZj5FnZ5lxMzPncOA'

const MarkerAndPopup = ({ restaurant, address, isShowPage }) => {
  const [showPopup, setShowPopup] = useState(false)
  return (
    <>
      <Marker
        key={restaurant._id}
        longitude={address.value.center[0]}
        latitude={address.value.center[1]}
        anchor='bottom'
        onClick={() => setShowPopup(!showPopup)}
        className='cursor-pointer'
        color={restaurant.reviewCount > 0 ? ratingColors[round(restaurant.avgRating)] : '#bbb'}
      />
      {showPopup && (
        <Popup
          longitude={address.value.center[0]}
          latitude={address.value.center[1]}
          anchor='bottom'
          offset={50}
          closeButton={false}
          onClose={() => setShowPopup(false)}
          closeOnClick={false}
        >
          <div
            className='relative w-36 flex flex-col items-center'
            onClick={() => window.open(`/restaurants/${restaurant._id}`)}
          >
            <div className='font-bold text-base mb-1'>{restaurant.name}</div>
            <RatingPill avgRating={restaurant.avgRating} reviewCount={restaurant.reviewCount} />
            <div className='text-xs mt-2'>{address.label}</div>
            <div
              onClick={(e) => {
                e.stopPropagation()
                setShowPopup(false)
              }}
              className='bg-gray-400 text-white w-6 h-6 rounded-full flex items-center justify-center absolute top-[-18px] right-[-18px] border-2 border-white shadow cursor-pointer hover:bg-black'
            >
              <X size={18} />
            </div>
          </div>
        </Popup>
      )}
    </>
  )
}

const MapMap = ({ restaurants, isShowPage }) => {
  const allCoordinates = flatten(restaurants.map((r) => r.addresses.map((a) => a.value.center)))
  const minLongitude = minBy(allCoordinates, (c) => c[0])?.[0]
  const minLatitude = minBy(allCoordinates, (c) => c[1])?.[1]
  const maxLongitude = maxBy(allCoordinates, (c) => c[0])?.[0]
  const maxLatitude = maxBy(allCoordinates, (c) => c[1])?.[1]

  if (restaurants.length === 0) return 'nothing'

  return (
    <div className='h-full'>
      <Map
        reuseMaps
        id='mymap'
        // initialViewState={{
        //   longitude: -72.5421,
        //   latitude: 46.343,
        //   zoom: 6,
        // }}
        bounds={[
          [minLongitude, minLatitude],
          [maxLongitude, maxLatitude],
        ]}
        fitBoundsOptions={{ padding: 60, maxZoom: 13 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {restaurants.map((restaurant) =>
          restaurant?.addresses?.map((address) => (
            <MarkerAndPopup
              key={`${restaurant.id}-${address.label}`}
              restaurant={restaurant}
              address={address}
              isShowPage={isShowPage}
            />
          ))
        )}
      </Map>
    </div>
  )
}

export default MapMap
