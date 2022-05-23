import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../../../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  const updatedRestaurant = await db.collection('restaurants').updateOne(
    { _id: ObjectId(req.query.id) },
    {
      $set: {
        name: req.body.name,
        addresses: req.body.addresses,
        website: req.body.website,
        phoneNumber: req.body.phoneNumber,
        priceRange: req.body.priceRange,
      },
    }
  )
  res.status(200).json(updatedRestaurant)
}

export default handler
