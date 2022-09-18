import RatingPill from 'components/RatingPill'
import ReadMore from 'components/ReadMore'
import { Image as ImageIcon, MapPin } from 'react-feather'
import { repeat } from 'lodash'
import { useRestaurantCardHover } from './context/RestaurantCardHoverProvider'
import classNames from 'classnames'
import { Image } from './Image'
import Link from 'next/link'

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

  const city = succursales[0].address?.context?.find((el) => el.id?.includes('place'))?.text

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

      <div style={{ minWidth: '68%' }}>
        <Link href={`/restaurants/${restaurant._id}`} passHref>
          <a rel='noopener noreferrer'>
            <div className='font-bold text-base lg:text-lg text-teal-600 hover:underline'>
              {name}
            </div>
          </a>
        </Link>

        <div className='mb-2 mt-1'>
          <RatingPill avgRating={avgRating} reviewCount={reviewCount} isNew />
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

export const TagSection = ({ priceRange, categories, city, succursales, smallText, address }) => {
  return (
    <>
      <div
        className={classNames('text-gray-500', {
          'text-xs': smallText,
          'text-sm font-light': !smallText,
        })}
      >
        <span className='bg-gray-600 px-1 rounded text-white'>
          {priceRange && `${repeat('$', priceRange)}`}
        </span>{' '}
        •{' '}
        {categories.map((c) => (
          <span key={c} className=''>
            {c} •{' '}
          </span>
        ))}
        <span className=''>{city}</span>
      </div>
      <div
        className={classNames('text-xs text-gray-400', {
          'mt-1': smallText,
          'mt-2': !smallText,
        })}
      >
        <MapPin size={15} className='inline mt-[-2px]' />{' '}
        {address ||
          (succursales.length === 1
            ? succursales[0].address.place_name.split(',')[0]
            : `${succursales.length} adresses au Québec`)}
      </div>
    </>
  )
}

export default RestaurantCard
