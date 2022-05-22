import React, { useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { X } from 'react-feather'
import { useRouter } from 'next/router'

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoibmljb2ZyYWlzc2UiLCJhIjoiY2thZzZtemk3MDE4NzJybXVtMjF5a2xyOSJ9.6JURdkZj5FnZ5lxMzPncOA'

const MarkerAndPopup = ({ restaurant, address }) => {
  const [showPopup, setShowPopup] = useState(false)
  const { push } = useRouter()
  return (
    <>
      <Marker
        key={restaurant._id}
        longitude={address.value.center[0]}
        latitude={address.value.center[1]}
        anchor='bottom'
        onClick={() => setShowPopup(!showPopup)}
        className='cursor-pointer'
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
            className='relative w-28 flex flex-col items-center'
            onClick={() => window.open(`/restaurants/${restaurant._id}`)}
          >
            <div className='font-bold text-base mb-1'>{restaurant.name}</div>
            <div className='px-2 bg-green-100 text-sm rounded flex items-center'>
              <span className='font-bold mr-1'>6/10</span>
              <span className='text-xs text-gray-600'> • 34 avis</span>
            </div>
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

const MapMap = ({ restaurants }) => {
  return (
    <div className='h-full'>
      <Map
        reuseMaps
        id='mymap'
        initialViewState={{
          longitude: -72.5421,
          latitude: 46.343,
          zoom: 6,
        }}
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
            />
          ))
        )}
      </Map>
    </div>
  )
}

export default MapMap
