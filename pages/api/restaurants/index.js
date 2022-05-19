import { connectToDatabase } from '../../../lib/db'

const handler = async (req, res) => {
  const client = await connectToDatabase()
  const db = await client.db()
  let result

  if (req.query.search) {
    result = await db
      .collection('restaurants')
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: req.query.search,
              path: 'name',
              fuzzy: {
                maxEdits: 1,
              },
            },
          },
        },
      ])
      .toArray()
  } else {
    result = await db.collection('restaurants').find({}).toArray()
  }
  res.status(200).json(result)
}

export default handler
