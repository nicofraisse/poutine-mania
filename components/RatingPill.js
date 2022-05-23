import classNames from 'classnames'
import { formatRating } from '../lib/formatRating'
import { round } from 'lodash'
import { ratingColors } from 'data/ratingColors'

const RatingPill = ({ avgRating, reviewCount, single }) => {
  return (
    <div
      className={classNames(
        'px-2 py-[4px] text-xs lg:text-sm text-gray-800 rounded flex items-center'
      )}
      style={{ backgroundColor: avgRating ? ratingColors[round(avgRating)] : '#eee' }}
    >
      {reviewCount > 0 ? (
        <>
          <span className='font-bold mr-1'>{formatRating(avgRating)}/10</span>
          {reviewCount && <span className='text-xs text-gray-600'> • {reviewCount} avis</span>}
        </>
      ) : (
        <span className='text-xs text-gray-600'>Aucun avis</span>
      )}
    </div>
  )
}

export default RatingPill