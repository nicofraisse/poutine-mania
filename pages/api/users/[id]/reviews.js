import { connectToDatabase } from '../../../../lib/db'
import { ObjectId } from 'mongodb'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()

  const data = await db
    .collection('reviews')
    .aggregate([
      {
        $match: {
          userId: new ObjectId(req.query.id),
        },
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantId',
          foreignField: '_id',
          as: 'restaurants',
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ])
    .toArray()

  res.status(200).json(data)
}

export default handler
