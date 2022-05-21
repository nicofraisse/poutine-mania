import { connectToDatabase } from '../../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()

  await db.collection('restaurants').insertOne({
    name: req.body.name,
    addresses: JSON.parse(req.body.addresses),
  })

  const data = await db.collection('restaurants').find({}).toArray()
  res.status(200).json({ data })
}

export default handler
