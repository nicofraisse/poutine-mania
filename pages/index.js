import Spinner from '../components/Spinner'
import ProfileReviewCard from '../components/ProfileReviewCard'
import { useGet } from '../lib/useAxios'
import { useEffect, useState } from 'react'

function HomePage() {
  const [paginationSkip, setPaginationSkip] = useState(0)
  const [allReviews, setAllReviews] = useState([])

  const { data: reviews, loading } = useGet(`/api/reviews?skip=${paginationSkip}`)

  const { data: restaurants, loading: restaurantsLoading } = useGet(
    `/api/restaurants?sort=avgRating&order=-1&limit=3&minReviewCount=3`
  )

  console.log(restaurants)

  useEffect(() => {
    if (reviews) {
      setAllReviews((prevAllReviews) => [...prevAllReviews, ...reviews])
    }
  }, [reviews])

  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target
    if (offsetHeight + scrollTop >= scrollHeight - 10) {
      console.log('bottom')
      setPaginationSkip(allReviews.length)
    }
  }

  if (!reviews) return <Spinner />

  return (
    <div className='h-screen-minus-navbar overflow-y-scroll' onScroll={handleScroll}>
      <div className='flex'>
        <div>
          <div className='max-w-[600px] m-2 sm:m-10'>
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
      </div>
    </div>
  )
}

export default HomePage
