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
import Color from 'color'

const ReviewCard = ({ review, handleEdit, handleDelete }) => {
  const [imgModalOpen, setImgModalOpen] = useState(false)
  const { currentUser } = useCurrentUser()

  return (
    <>
      <div className='py-2 lg:py-4 border-t flex'>
        <div className='basis-1/6 flex flex-col items-center justify-centere text-gray-500'>
          <Link href={`/users/${review.user._id}`} passHref>
            <div className='pr-3 min-w-36'>
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
                <div className='text-center text-xs sm:text-sm mt-2 break-words max-w-28'>
                  {review.user.name}
                </div>
                <div className='text-center font-light text-xs'>
                  {review.user.reviews.length} avis
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className='basis-5/6 shrink pt-2'>
          <div className='text-base font-bold items-center flex mb-3'>
            <span
              className='py-[1px] px-[6px] bg-green-200 rounded mr-2 text-lg text-white flex items-center'
              style={{
                backgroundColor: Color(ratingColors[round(review.rating)])
                  .darken(0.4)
                  .desaturate(0.3),
              }}
            >
              {formatRating(review.rating)}
              <span className='text-white font-normal text-xs text-opacity-80 ml-[2px] -mb-[2px]'>
                {' '}
                /10
              </span>
            </span>
            {/* {review.title}{' '}
            {review.title && <span className='text-gray-400 ml-1 font-normal'>•</span>} */}
            <span className='text-gray-500 text-[14px] font-normal'>
              {formatDate(review.createdAt, 'd MMMM yyyy')}
            </span>
            {(review.userId === currentUser?._id || currentUser?.isAdmin) && (
              <>
                <span className='text-gray-400 mx-2'>•</span>

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

          <div className='text-gray-500 break-words font-light'>{review.comment}</div>

          {review.photos?.[0] && (
            <Image
              publicId={review.photos?.[0]}
              alt='poutine-user-photo'
              // width={280
              responsive
              className='border rounded-md object-cover h-72 w-100 my-3'
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
