import { hashPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/db'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return
  }

  const data = req.body

  const { email, name, password } = data

  if (!email || !email.includes('@')) {
    res.status(422).json({
      message: 'Addresse courriel invalide. Vérifiez qu\'elle contient bien le "@".',
    })
    return
  }
  if (!password || password.trim().length < 6) {
    res.status(422).json({
      message: 'Le mot de passe doit faire au moins 6 caractères.',
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
    name: name,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  res.status(201).json({ message: 'Utilisateur créé!' })
  client.close()
}

export default handler
