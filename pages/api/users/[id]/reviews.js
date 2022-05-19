import { connectToDatabase } from '../../../../lib/db'
import { getSession } from 'next-auth/client'
import { ObjectId } from 'mongodb'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  const session = await getSession({ req })

  const data = await db
    .collection('reviews')
    .aggregate([
      {
        $match: {
          userId: new ObjectId(session.user._id),
        },
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantId',
          foreignField: '_id',
          as: 'restaurant',
        },
      },
      { $unwind: '$restaurant' },
    ])
    .toArray()

  res.status(200).json(data)
}

export default handler
