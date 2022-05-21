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
          restaurantId: new ObjectId(req.query.id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
    ])
    .toArray()

  res.status(200).json(data)
}

export default handler
