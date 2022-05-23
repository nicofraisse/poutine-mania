import { connectToDatabase } from '../../../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()

  const data = await db.collection('reviews').find({}).toArray()

  res.status(200).json(data)
}

export default handler
