// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { connectToDatabase } from '../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()

  await db.collection('steaks').insertOne({
    qty: Math.random() * 2000,
  })

  const data = await db.collection('steaks').find({}).toArray()
  res.status(200).json({ data })
}

export default handler
