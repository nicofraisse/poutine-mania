import Spinner from '../components/Spinner'
import ProfileReviewCard from '../components/ProfileReviewCard'
import { useGet } from '../lib/useAxios'
import { useEffect, useState } from 'react'

function HomePage() {
  const [paginationSkip, setPaginationSkip] = useState(0)
  const [allReviews, setAllReviews] = useState([])

  const { data: reviews, loading } = useGet(`/api/reviews?skip=${paginationSkip}`)

  useEffect(() => {
    if (reviews) {
      setAllReviews((prevAllReviews) => [...prevAllReviews, ...reviews])
    }
  }, [reviews])

  const handleScroll = (e) => {
    console.log('scroling')
    const { offsetHeight, scrollTop, scrollHeight } = e.target

    if (offsetHeight + scrollTop === scrollHeight) {
      console.log('it is now')
      setPaginationSkip(allReviews.length)
    }
  }

  if (!reviews) return <Spinner />

  return (
    <div
      className='py-10 px-2 md:px-0 h-screen-minus-navbar overflow-y-scroll'
      onScroll={handleScroll}
    >
      <div className='max-w-[600px] mx-auto'>
        {allReviews.map((review) => (
          <ProfileReviewCard review={review} key={review._id} />
        ))}
      </div>
      {loading && (
        <div className='my-3 flex justify-center'>
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default HomePage
