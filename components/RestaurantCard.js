import RatingPill from 'components/RatingPill'
import ReadMore from 'components/ReadMore'
import { Image as ImageIcon, MapPin } from 'react-feather'
import { repeat } from 'lodash'
import { useRestaurantCardHover } from './context/RestaurantCardHoverProvider'
import classNames from 'classnames'
import { Image } from './Image'

const LastComment = ({ comment }) => {
  if (!comment) return null
  return (
    <div className='text-ellipsis text-xs text-gray-500 mt-3'>
      <ReadMore text={comment} withQuotes />
    </div>
  )
}

const RestaurantCard = ({ restaurant }) => {
  const { avgRating, name, reviewCount, succursales, reviews } = restaurant
  const { setHoveredId, hoveredId } = useRestaurantCardHover()
  const lastComment = reviews[0]?.comment

  const city = restaurant.succursales[0].address?.context?.find((el) =>
    el.id?.includes('place')
  )?.text

  const image = restaurant.reviews?.find((r) => r.photos?.[0])?.photos[0]

  return (
    <div
      className={classNames('py-3 lg:py-6 px-1 lg:px-2 flex justify-between items-start', {
        'bg-slate-': hoveredId === restaurant._id,
      })}
      onMouseEnter={() => setHoveredId(restaurant._id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <div
        className='bg-gray-100 rounded w-1/4 h-28 mr-2 lg:mr-3 flex items-center justify-center'
        style={{ minWidth: '29%' }}
      >
        {image ? (
          <Image
            publicId={image}
            alt={`${restaurant.name}-photo`}
            className='w-full h-full object-cover object-center rounded'
          />
        ) : (
          <ImageIcon className='text-gray-300' size={48} alt='placeholder' />
        )}
      </div>

      <div style={{ minWidth: '71%' }}>
        <div className='flex justify-between items-start mb-1 lg:mb-1'>
          <div className='font-bold text-base lg:text-lg text-teal-600'>{name}</div>
          <div className='ml-2'>
            <RatingPill avgRating={avgRating} reviewCount={reviewCount} />
          </div>
        </div>
        <div className='text-xs text-gray-500'>
          <span className='font-bold'>
            {restaurant.priceRange && `${repeat('$', restaurant.priceRange)}	• `}
          </span>
          {restaurant.categories.map((c) => (
            <span key={c} className='font-bold'>
              {c} •{' '}
            </span>
          ))}
          <span className='font-bold'>{city}</span>
        </div>
        <div className='text-xs mt-2 text-gray-400'>
          <MapPin size={15} className='inline mt-[-2px]' />{' '}
          {succursales.length === 1
            ? succursales[0].address.place_name.split(',')[0]
            : `${succursales.length} adresses au Québec`}
        </div>
        {/* <LastComment comment={lastComment} /> */}
      </div>
    </div>
  )
}

export default RestaurantCard
