import React, { useState } from 'react'
import { formatRating } from '../lib/formatRating'
import { formatName } from '../lib/formatName'
import { formatDate } from 'lib/formatDate'
import { useCurrentUser } from 'lib/useCurrentUser'
import { ratingColors } from '../data/ratingColors'
import { round } from 'lodash'
import { User, X } from 'react-feather'
import { Image } from './Image'
import Modal from 'react-responsive-modal'
import Link from 'next/link'
import NextImage from 'next/image'

const ReviewCard = ({ review, handleEdit, handleDelete }) => {
  const [imgModalOpen, setImgModalOpen] = useState(false)
  const { currentUser } = useCurrentUser()

  return (
    <>
      <div className='py-3 lg:py-6 border-t flex'>
        <div className='basis-1/6 flex flex-col items-center justify-centere text-gray-500'>
          <Link href={`/users/${review.user._id}`} passHref>
            <div className='pr-3 min-w-24'>
              <div className='py-2 px-2 sm:px-3 flex flex-col items-center border-gray-100 rounded-lg hover:bg-gray-100 transition duration-150 cursor-pointer'>
                <div className='bg-gray-50 border h-12 w-12 rounded-full text-gray-300 flex items-center justify-center'>
                  {review.user.image ? (
                    <NextImage
                      alt='user-image'
                      src={review.user.image}
                      width='100%'
                      height='100%'
                      className='rounded-full object-cover object-center'
                    />
                  ) : (
                    <User />
                  )}
                </div>
                <div className='text-center text-xs sm:text-sm mt-2 font-bold break-words max-w-28'>
                  {review.user.firstName || review.user.name}
                </div>
                <div className='text-center text-sm'>{review.user.reviews.length} avis</div>
              </div>
            </div>
          </Link>
        </div>
        <div className='basis-5/6 shrink'>
          <div className='text-base font-bold inline items-center'>
            <span
              className='py-1 px-2 bg-green-200 rounded mr-2 text-gray-700'
              style={{ backgroundColor: ratingColors[round(review.rating)] }}
            >
              {formatRating(review.rating)}/10
            </span>
            {review.title}{' '}
            {review.title && <span className='text-gray-400 ml-1 font-normal'>???</span>}
            <span className='text-gray-400 text-[15px] ml-1 font-normal'>
              {formatDate(review.createdAt, 'd MMMM yyyy')}
            </span>
            {(review.userId === currentUser?._id || currentUser?.isAdmin) && (
              <>
                <span className='text-gray-400 mx-2'>???</span>

                <button
                  className='text-sm text-gray-400 hover:text-gray-500'
                  onClick={() => handleEdit(review)}
                >
                  Modifier
                </button>
                <span className='text-sm text-gray-400 font-normal mx-1'>/</span>
                <button
                  className='text-sm text-gray-400 hover:text-gray-500'
                  onClick={() => handleDelete(review._id)}
                >
                  Supprimer
                </button>
              </>
            )}
          </div>

          <div className='text-gray-700 break-words my-2'>{review.comment}</div>

          {review.photos?.[0] && (
            <Image
              publicId={review.photos?.[0]}
              alt='poutine-user-photo'
              width={200}
              className='border rounded-md'
              onClick={() => setImgModalOpen(true)}
            />
          )}
        </div>
      </div>
      <Modal
        classNames={{
          overlay: 'customOverlay',
          modal: 'customModal',
        }}
        open={imgModalOpen}
        onClose={() => setImgModalOpen(false)}
        closeIcon={<X />}
        center
      >
        <div className='border w-full '>
          <Image
            publicId={review.photos?.[0]}
            alt='poutine-user-photo'
            width={'100%'}
            className='border rounded-md'
            onClick={() => setImgModalOpen(true)}
          />
        </div>
      </Modal>
    </>
  )
}

export default ReviewCard
