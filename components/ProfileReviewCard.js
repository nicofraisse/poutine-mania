import Link from 'next/link'
import React, { useState } from 'react'
import { Edit3, X, MessageCircle } from 'react-feather'
import Modal from 'react-responsive-modal'
import { Image } from './Image'
import RatingPill from './RatingPill'
import { formatDate } from 'lib/formatDate'

const ProfileReviewCard = ({ review }) => {
  const [imgModalOpen, setImgModalOpen] = useState(false)
  return (
    <>
      <div className='flex items-center text-gray-400'>
        <Edit3 size={20} className='mr-1 inline' /> Nicolas Fraisse a noté{' '}
        <Link href={`/restaurants/${review.restaurants[0]._id}`}>
          <a className='text-teal-500 ml-[6px] font-bold hover:text-teal-600'>
            {review.restaurants[0].name}
          </a>
        </Link>
      </div>
      <div className='text-gray-700 mb mt-2 mb-8 border shadow-md rounded-lg p-4'>
        {/* <div className='flex items-center mb-2 pb-2'>
          <div className='px-2 w-full border-b pb-2 rounded-lg'>
           
            · Montréal, QC (11 avis)
          </div>
        </div> */}
        <div className='flex mb-2 items-center'>
          <RatingPill avgRating={review.rating} reviewCount={1} single />
          <span className='font-bold ml-2'>{review.title}</span>
          <span className='text-gray-400 text-sm ml-2 font-normal'>
            · le {formatDate(review.createdAt, 'dd/MM/yyyy')}
          </span>
        </div>
        <p className='rounded-lg p-1 w-full'>{review.comment}</p>
        <div className='flex items-start'>
          {review.photos?.[0] && (
            <Image
              publicId={review.photos?.[0]}
              alt='poutine-user-photo'
              width={1000}
              className='border rounded-md mr-3 mt-3'
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

export default ProfileReviewCard
