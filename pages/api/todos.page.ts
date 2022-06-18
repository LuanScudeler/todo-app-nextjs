import { COLLECTIONS, initdb } from 'lib/initdb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoItem[]>
) {
  let todosCursor
  try {
    const todos = await initdb<TodoItem>(COLLECTIONS.TODOS)

    todosCursor = await todos.find()
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }

  const result = await todosCursor?.toArray()
  res.status(200).json(result || [])
}
