import { connectToDatabase } from '../../../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()

  const data = await db
    .collection('reviews')
    .aggregate([
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantId',
          foreignField: '_id',
          as: 'restaurants',
        },
      },
    ])
    .toArray()

  res.status(200).json(data)
}

export default handler
