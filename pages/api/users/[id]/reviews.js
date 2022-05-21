import { connectToDatabase } from '../../../../lib/db'
import { getSession } from 'next-auth/client'
import { ObjectId } from 'mongodb'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  const session = await getSession({ req })
  console.log(req.query)

  const data = await db.collection('reviews').find({}).toArray()

  res.status(200).json(data)
}

export default handler
