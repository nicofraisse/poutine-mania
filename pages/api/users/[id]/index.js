import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../../../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  const user = await db.collection('users').findOne({ _id: new ObjectId(req.query.id) })

  res.status(200).json(user)
}

export default handler
