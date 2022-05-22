import { connectToDatabase } from '../../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  let result

  if (req.query.search) {
    result = await db
      .collection('restaurants')
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: req.query.search,
              path: 'name',
              fuzzy: {
                maxEdits: 1,
              },
            },
          },
        },
      ])
      .toArray()
  } else {
    result = await db
      .collection('restaurants')
      .aggregate([
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'restaurantId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            avgRating: { $avg: '$reviews.rating' },
          },
        },
      ])
      .toArray()
  }
  res.status(200).json(result)
}

export default handler
