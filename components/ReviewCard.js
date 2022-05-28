import React from 'react'
import { formatRating } from '../lib/formatRating'
import { formatName } from '../lib/formatName'
import { formatDate } from 'lib/formatDate'
import { useCurrentUser } from 'lib/useCurrentUser'
import { ratingColors } from '../data/ratingColors'
import { round } from 'lodash'
import { Edit, Trash } from 'react-feather'

const ReviewCard = ({ review, handleEdit, handleDelete }) => {
  const { currentUser } = useCurrentUser()
  return (
    <div className='py-3 lg:py-6 border-t flex'>
      <div className='basis-1/6 flex flex-col items-center justify-centere text-gray-500'>
        <div className='py-2 px-6 border-gray-100 rounded-lg hover:bg-gray-100 transition duration-150 cursor-pointer'>
          <div className='bg-gray-300 border h-12 w-12 rounded-full'></div>
          <div className='text-center text-sm mt-2 font-bold'>{review.user.firstName}</div>
          <div className='text-center text-sm'>4 avis</div>
        </div>
      </div>
      <div className='basis-5/6 shrink'>
        <div className='text-base font-bold mb-3'>
          <span
            className='py-1 px-2 bg-green-200 rounded mr-2 text-gray-700'
            style={{ backgroundColor: ratingColors[round(review.rating)] }}
          >
            {formatRating(review.rating)}/10
          </span>
          {review.title}{' '}
          <span className='text-gray-400 text-base ml-0 font-normal mb-2'>
            • Publié le {formatDate(review.createdAt, 'dd/MM/yyyy')}
          </span>
        </div>

        <div className='text-gray-700 text-sm'>{review.comment}</div>
      </div>
    </div>
  )
}

const OldReviewCard = ({ review, handleEdit, handleDelete }) => {
  const { currentUser } = useCurrentUser()
  return (
    <div className='py-3 lg:py-6 lg:px-1 border-t'>
      <div className='flex lg:flex-row flex-col-reverse lg:items-center lg:justify-between'>
        <div>
          <h3 className='font-bold inline text-sm lg:text-base'>
            <span
              className='p-2 bg-green-200 rounded mr-1'
              style={{ backgroundColor: ratingColors[round(review.rating)] }}
            >
              {formatRating(review.rating)}/10
            </span>{' '}
            {review.title}
          </h3>
          <div className='text-gray-400 ml-1 text-xs lg:text-sm inline'>
            - par{' '}
            <span className='font-bold cursor-pointer hover:text-gray-500'>
              {formatName(review.user)}
            </span>
            , le {formatDate(review.createdAt, 'dd/MM/yyyy')}
          </div>
        </div>
        {(review.userId === currentUser?._id || currentUser?.isAdmin) && (
          <div className='flex items-center lg:mb-0 mb-2'>
            <button
              className='text-sm text-gray-400 px-2 py-1 hover:bg-gray-100 rounded'
              onClick={() => handleEdit(review)}
            >
              <Edit />
            </button>
            <button
              className='text-sm text-gray-400 px-2 py-1 hover:bg-gray-100 rounded'
              onClick={() => handleDelete(review._id)}
            >
              <Trash />
            </button>
          </div>
        )}
      </div>

      <p className='text-gray-600 mt-4 text-xs lg:text-sm'>{review.comment}</p>
    </div>
  )
}

export default ReviewCard
