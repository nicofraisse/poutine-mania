import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../../../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  const data = await db
    .collection('restaurants')
    .aggregate([
      { $match: { _id: ObjectId(req.query.id) } },
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
  res.status(200).json(data[0])
}

export default handler
