import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../../../../lib/db'
import { getSession } from 'next-auth/client'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  const session = await getSession({ req })

  if (session.user._id === req.query.id) {
    const updatedUser = await db.collection('users').updateOne(
      { _id: ObjectId(session.user._id) },
      {
        $set: {
          deletedAt: new Date(),
        },
      }
    )
    res.status(200).json(updatedUser)
  } else {
    res.status(401).json('Accès non autorisé')
  }
}

export default handler
