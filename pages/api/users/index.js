import { connectToDatabase } from '../../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  const result = await db.collection('users').find({}).toArray()

  res.status(200).json(result)
}

export default handler
