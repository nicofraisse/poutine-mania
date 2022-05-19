import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../../../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  const deletedRestaurant = await db
    .collection('restaurants')
    .deleteOne({ _id: ObjectId(req.query.id) })
  res.status(200).json(deletedRestaurant)
}

export default handler
