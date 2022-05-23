import React from 'react'
import { formatRating } from '../lib/formatRating'
import { formatName } from '../lib/formatName'
import { formatDate } from 'lib/formatDate'
import { useCurrentUser } from 'lib/useCurrentUser'

const ReviewCard = ({ review, handleEdit, handleDelete }) => {
  const { currentUser } = useCurrentUser()
  return (
    <div className='py-6 px-1 border-t'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='font-bold inline'>
            <span className='p-2 bg-green-200 rounded mr-1'>{formatRating(review.rating)}/10</span>{' '}
            {review.title}
          </h3>
          <div className='text-gray-400 ml-1 text-sm inline'>
            - par{' '}
            <span className='font-bold cursor-pointer hover:text-gray-500'>
              {formatName(review.user)}
            </span>
            , le {formatDate(review.createdAt, 'dd/MM/yyyy')}
          </div>
        </div>
        {review.userId === currentUser?._id && (
          <div className='flex items-center'>
            <button
              className='text-sm text-gray-400 px-2 py-1 hover:bg-gray-100 rounded'
              onClick={() => handleEdit(review)}
            >
              Modifier
            </button>
            <button
              className='text-sm text-gray-400 px-2 py-1 hover:bg-gray-100 rounded'
              onClick={() => handleDelete(review._id)}
            >
              Supprimer
            </button>
          </div>
        )}
      </div>

      <p className='text-gray-600 mt-4 text-sm'>{review.comment}</p>
    </div>
  )
}

export default ReviewCard
