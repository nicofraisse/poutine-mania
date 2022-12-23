import { ObjectId } from "mongodb";
import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../../lib/db";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();
  const session = await getSession({ req });

  if (!(session.user.isAdmin || session.user._id === req.query.id)) {
    res.status(403).json(unauthorized);
  }

  console.log(req.body);
  const updatedUser = await db.collection("users").updateOne(
    { _id: ObjectId(req.query.id) },
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        // email: req.body.email,
        image: req.body.image,
      },
    }
  );
  res.status(200).json(updatedUser);
};

export default handler;
