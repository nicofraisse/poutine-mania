import classNames from 'classnames'
import { formatRating } from '../lib/formatRating'
import { round } from 'lodash'
import { ratingColors } from 'data/ratingColors'

const RatingPill = ({ avgRating, reviewCount, single }) => {
  return (
    <div
      className={classNames(
        'text-xs lg:text-sm text-gray-800 rounded flex items-center justify-center',
        {
          'h-6 min-w-20': reviewCount === 0 && !single,
          'h-8 min-w-24': reviewCount !== 0 && !single,
          'h-7 min-w-14 flex justify-center': single,
        }
      )}
      style={{ backgroundColor: avgRating ? ratingColors[round(avgRating)] : '#eee' }}
    >
      {reviewCount > 0 ? (
        <>
          <span className='font-bold'>{formatRating(avgRating)}/10</span>
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

export default RatingPill
