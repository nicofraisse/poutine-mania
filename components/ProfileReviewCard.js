import Link from 'next/link'
import React, { useState } from 'react'
import { X } from 'react-feather'
import Modal from 'react-responsive-modal'
import { Image } from './Image'
import RatingPill from './RatingPill'

const ProfileReviewCard = ({ review }) => {
  const [imgModalOpen, setImgModalOpen] = useState(false)
  return (
    <>
      <div className='border p-3 my-2'>
        <div className='flex'>
          {review.photos?.[0] && (
            <Image
              publicId={review.photos?.[0]}
              alt='poutine-user-photo'
              width={200}
              className='border rounded-md'
              onClick={() => setImgModalOpen(true)}
            />
          )}
          <div className='pl-3 grow'>
            <div className='flex justify-between items-center mb-2'>
              <Link href={`/restaurants/${review.restaurants[0]._id}`}>
                <a className='text-teal-500 text-lg font-bold hover:text-teal-600'>
                  {review.restaurants[0].name}
                </a>
              </Link>
              <RatingPill avgRating={review.rating} reviewCount={1} single />
            </div>
            <p className='text-gray-700'>{review.comment}</p>
          </div>
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
