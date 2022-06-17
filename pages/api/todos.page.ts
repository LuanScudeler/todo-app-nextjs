import clientPromise from 'lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoItem[]>
) {
  let todosCursor
  try {
    const client = await clientPromise
    const db = client.db('nextjs_app_db')
    const todos = db.collection<TodoItem>('todos')

    todosCursor = await todos.find()
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }

  const result = await todosCursor?.toArray()
  res.status(200).json(result || [])
}
