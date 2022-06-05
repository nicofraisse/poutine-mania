import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../../../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  const updatedReview = await db
    .collection('reviews')
    .updateOne(
      { _id: ObjectId(req.query.id) },
      {
        $set: {
          title: req.body.title,
          rating: req.body.rating,
          comment: req.body.comment,
          photos: req.body.photos,
        },
      }
    )
  res.status(200).json(updatedReview)
}

export default handler
