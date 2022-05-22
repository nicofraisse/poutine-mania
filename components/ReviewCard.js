import React from 'react'
import { formatRating } from '../lib/formatRating'
import { formatName } from '../lib/formatName'

const ReviewCard = ({ review }) => {
  return (
    <div className='py-6 px-1 border-t'>
      <h3 className='font-bold inline'>
        <span className='p-2 bg-green-200 rounded mr-1'>{formatRating(review.rating)}/10</span>{' '}
        Excellente poutine!
      </h3>
      <div className='text-gray-400 ml-1 text-sm inline'>
        - par{' '}
        <span className='font-bold cursor-pointer hover:text-gray-500'>
          {formatName(review.user)}
        </span>
        , le 30/02/2021
      </div>

      <p className='text-gray-600 mt-4 text-sm'>
        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta
        nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere
        possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam
        et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae
        sint et molestiae non recusandae.
      </p>
    </div>
  )
}

export default ReviewCard
