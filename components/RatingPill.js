import classNames from 'classnames'
import { formatRating } from '../lib/formatRating'
import { round } from 'lodash'
import { ratingColors } from 'data/ratingColors'
import { Star } from 'react-feather'

const RatingPill = ({ avgRating, reviewCount, single, isStar }) => {
  if (isStar) return <StarRating avgRating={avgRating} reviewCount={reviewCount} />
  return (
    <div
      className={classNames(
        'text-xs lg:text-sm text-gray-800 rounded flex items-center justify-center',
        {
          'h-6 min-w-20': reviewCount === 0 && !single,
          'h-8 min-w-24': reviewCount !== 0 && !single,
          'h-7 min-w-14 justify-center': single,
        }
      )}
      style={{ backgroundColor: avgRating ? ratingColors[round(avgRating)] : '#eee' }}
    >
      {reviewCount > 0 ? (
        <>
          <span className='font-bold flex items-center'>{formatRating(avgRating)}/10</span>
          {reviewCount && !single && (
            <span className='text-xs text-gray-600 ml-1'> • {reviewCount} avis</span>
          )}
        </>
      ) : (
        <span className='text-xs text-gray-600'>Aucun avis</span>
      )}
    </div>
  )
}

const StarRating = ({ avgRating, reviewCount }) => {
  return (
    <div className='flex items-center my-1'>
      <Star
        fill={reviewCount > 0 ? '#ffcb6b' : 'white'}
        color={reviewCount > 0 ? '#ffcb6b' : '#aaa'}
        size={22}
      />
      {reviewCount > 0 && (
        <span className='font-bold text-lg text-gray-700 ml-1'>{formatRating(avgRating)}</span>
      )}
      <span className='mx-2 text-gray-500'>({reviewCount} avis)</span>
    </div>
  )
}

export default RatingPill
