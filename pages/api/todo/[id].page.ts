import { COLLECTIONS, initdb } from 'lib/initdb'
import { getErrorMessage } from 'lib/utils/getErrorMessage'
import { ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req
  const { id } = query as { id: string }

  switch (method) {
    case 'PUT':
      res.status(200).json({})
      break
    case 'DELETE':
      try {
        const todos = await initdb<InsertTodoItem>(COLLECTIONS.TODOS)

        const result = await todos.deleteOne({
          _id: new ObjectId(id),
        })
      } catch (err) {
        console.error(err)
        res.status(500).send({ message: getErrorMessage(err) })
      }

      res.status(200).end()

      break
    default:
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
