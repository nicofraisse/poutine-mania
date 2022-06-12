import { hashPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/db'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return
  }

  const data = req.body

  const { email, firstName, lastName, password } = data

  if (!email || !email.includes('@') || !password || password.trim().length < 7) {
    res.status(422).json({
      message: 'Invalid input - password should also be at least 7 characters long.',
    })
    return
  }

  const client = await connectToDatabase()

  const db = client.db()

  const existingUser = await db.collection('users').findOne({ email: email })

  if (existingUser) {
    res.status(422).json({ message: 'Ce courriel est déjà utilisé!' })
    client.close()
    return
  }

  const hashedPassword = await hashPassword(password)

  await db.collection('users').insertOne({
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  res.status(201).json({ message: 'Utilisateur créé!' })
  client.close()
}

export default handler
