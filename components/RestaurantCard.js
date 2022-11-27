import RatingPill from 'components/RatingPill'
import ReadMore from 'components/ReadMore'
import { Image as ImageIcon, MapPin } from 'react-feather'
import { repeat } from 'lodash'
import { useRestaurantCardHover } from './context/RestaurantCardHoverProvider'
import classNames from 'classnames'
import { Image } from './Image'
import Link from 'next/link'
import { useRateRestaurant } from './context/RateRestaurantProvider'

const LastComment = ({ comment }) => {
  if (!comment) return null
  return (
    <div className='text-ellipsis text-xs text-gray-500 mt-3'>
      <ReadMore text={comment} withQuotes />
    </div>
  )
}

const RestaurantCard = ({ restaurant }) => {
  const { avgRating, name, reviewCount, succursales, reviews, categories, priceRange } = restaurant
  const { setHoveredId, hoveredId } = useRestaurantCardHover()
  const lastComment = reviews[0]?.comment
  const { rateRestaurant } = useRateRestaurant()

  const city = succursales[0].address?.context?.find((el) => el.id?.includes('neighborhood'))?.text

  const image = reviews?.find((r) => r.photos?.[0])?.photos[0]

  return (
    <div
      className={classNames(
        'py-3 px-1 lg:px-4 flex justify-between items-start transition duration-100',
        {
          'bg-gray-50': hoveredId === restaurant._id,
        }
      )}
      onMouseEnter={() => setHoveredId(restaurant._id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <div
        className='bg-gray-100 rounded-sm w-1/4 h-28 min-w-28 mr-2 lg:mr-3 flex items-center justify-center '
        style={{ minWidth: '29%' }}
      >
        {image ? (
          <Image
            publicId={image}
            alt={`${name}-photo`}
            className='h-28 min-w-28 object-cover object-center rounded-sm'
          />
        ) : (
          <ImageIcon className='text-gray-300' size={48} alt='placeholder' />
        )}
      </div>

      <div style={{ minWidth: '71%' }}>
        <Link href={`/restaurants/${restaurant._id}`} passHref>
          <a rel='noopener noreferrer'>
            <div className='font-bold text-base lg:text-lg text-teal-600 hover:underline'>
              {name}
            </div>
          </a>
        </Link>

        <div className='mb-2 mt-1'>
          <RatingPill
            avgRating={avgRating}
            reviewCount={reviewCount}
            isNew
            onRate={(number) => rateRestaurant(restaurant)}
          />
        </div>

        <TagSection
          succursales={succursales}
          categories={categories}
          city={city}
          priceRange={priceRange}
        />
        {/* <LastComment comment={lastComment} /> */}
      </div>
    </div>
  )
}

export const TagSection = ({
  priceRange,
  categories,
  city,
  succursales,
  smallText,
  address,
  largeText,
  darkBackground,
  noAddress,
}) => {
  return (
    <>
      <div
        className={classNames('text-ellipsis', {
          'text-xs': smallText,
          'text-sm font-light': !smallText && !largeText,
          'text-md font-light': largeText,
          'text-gray-500': !darkBackground,
          'text-white': darkBackground,
        })}
      >
        <span className='bg-gray-600 px-1 rounded text-white'>
          {priceRange && `${repeat('$', priceRange)}`}
        </span>{' '}
        •{' '}
        {categories.map((c, i) => (
          <span key={i} className=''>
            {c} •{' '}
          </span>
        ))}
        <span className=''>{city}</span>
      </div>
      {!noAddress && (
        <div
          className={classNames('text-xs', {
            'mt-1 text-xs': smallText,
            'mt-2 text-xs': !smallText && !largeText,
            'mt-2 text-sm': largeText,
            'text-gray-400': !darkBackground,
            'text-white': darkBackground,
          })}
        >
          <MapPin size={15} className='inline mt-[-2px]' />{' '}
          {address ||
            (succursales.length === 1
              ? succursales[0].address.place_name.split(', Q')[0]
              : `${succursales.length} adresses au Québec`)}
        </div>
      )}
    </>
  )
}

export default RestaurantCard
