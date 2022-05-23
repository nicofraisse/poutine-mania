import { ObjectId } from 'mongodb'
import { connectToDatabase } from 'lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  const deletedReview = await db.collection('reviews').deleteOne({ _id: ObjectId(req.query.id) })
  res.status(200).json(deletedReview)
}

export default handler
