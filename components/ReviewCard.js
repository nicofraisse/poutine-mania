import React from 'react'
import { formatRating } from '../lib/formatRating'
import { formatName } from '../lib/formatName'
import { formatDate } from 'lib/formatDate'
import { useCurrentUser } from 'lib/useCurrentUser'
import { ratingColors } from '../data/ratingColors'
import { round } from 'lodash'
import { Edit, Trash, User } from 'react-feather'
import { Image } from './Image'

const ReviewCard = ({ review, handleEdit, handleDelete }) => {
  console.log(review)
  const { currentUser } = useCurrentUser()
  return (
    <div className='py-3 lg:py-6 border-t flex'>
      <div className='basis-1/6 flex flex-col items-center justify-centere text-gray-500'>
        <div className='py-2 px-6 border-gray-100 rounded-lg hover:bg-gray-100 transition duration-150 cursor-pointer'>
          <div className='bg-gray-50 border h-12 w-12 rounded-full text-gray-300 flex items-center justify-center'>
            <User />
          </div>
          <div className='text-center text-sm mt-2 font-bold'>{review.user.firstName}</div>
          <div className='text-center text-sm'>4 avis</div>
        </div>
      </div>
      <div className='basis-5/6 shrink'>
        <div className='text-base font-bold mb-3 flex items-center'>
          <span
            className='py-1 px-2 bg-green-200 rounded mr-2 text-gray-700'
            style={{ backgroundColor: ratingColors[round(review.rating)] }}
          >
            {formatRating(review.rating)}/10
          </span>
          {review.title}{' '}
          {review.title && <span className='text-gray-400 ml-2 mr-1 font-normal'>•</span>}
          <span className='text-gray-400 text-sm ml-1 font-normal'>
            Publié le {formatDate(review.createdAt, 'dd/MM/yyyy')}
          </span>
          {(review.userId === currentUser?._id || currentUser?.isAdmin) && (
            <>
              <span className='text-gray-400 mx-2'>•</span>
              <button
                className='text-sm text-gray-400 hover:text-gray-500'
                onClick={() => handleEdit(review)}
              >
                modifier
              </button>
              <span className='text-sm text-gray-400 font-normal mx-1'>/</span>
              <button
                className='text-sm text-gray-400 hover:text-gray-500'
                onClick={() => handleDelete(review._id)}
              >
                supprimer
              </button>
            </>
          )}
        </div>

        <div className='text-gray-700 break-words mb-2'>{review.comment}</div>

        <Image
          publicId={review.photos[0]}
          alt='poutine-user-photo'
          width={200}
          className='border rounded-md'
        />
      </div>
    </div>
  )
}

export default ReviewCard
