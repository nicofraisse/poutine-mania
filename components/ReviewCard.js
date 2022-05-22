import React from 'react'

const ReviewCard = ({ review }) => {
  return (
    <div className='py-6 px-1 border-t'>
      <h3 className='font-bold inline'>
        <span className='p-2 bg-green-200 rounded mr-1'>{review.rating}/10</span> Excellente
        poutine!
      </h3>
      <div className='text-gray-400 ml-1 text-sm inline'>
        - par <span className='font-bold'>Madelaine Cyr</span>, 30/02/2021
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
