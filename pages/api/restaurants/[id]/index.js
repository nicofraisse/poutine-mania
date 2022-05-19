import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../../../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  const data = await db.collection('restaurants').findOne({ _id: ObjectId(req.query.id) })
  res.status(200).json(data)
}

export default handler
