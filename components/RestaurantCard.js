import RatingPill from 'components/RatingPill'
import ReadMore from 'components/ReadMore'
import { Image } from 'react-feather'

const LastComment = ({ comment }) => {
  if (!comment) return null
  return (
    <div className='text-ellipsis text-xs text-gray-500 mt-3'>
      <ReadMore text={comment} withQuotes />
    </div>
  )
}

const RestaurantCard = ({ restaurant }) => {
  const { avgRating, name, reviewCount, addresses, reviews } = restaurant
  const lastComment = reviews[0]?.comment

  return (
    <div className='py-6 px-2 flex justify-between items-start hover:bg-slate-50  bg-'>
      <div
        className='bg-gray-100 rounded w-1/4 h-24 mr-3 flex items-center justify-center'
        style={{ minWidth: '23%' }}
      >
        <Image className='text-gray-300' size={48} alt='placeholder' />
      </div>
      <div style={{ minWidth: '75%' }}>
        <div className='flex justify-between items-center mb-2'>
          <div className='font-bold text-lg'>{name}</div>
          <RatingPill avgRating={avgRating} reviewCount={reviewCount} />
        </div>

        <div className='text-sm text-gray-500'>
          {addresses.length === 1 ? addresses[0].label : `${addresses.length} adresses au Québec`}
        </div>
        <LastComment comment={lastComment} />
      </div>
    </div>
  )
}

export default RestaurantCard
