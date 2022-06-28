import { COLLECTIONS, initdb } from 'lib/initdb'
import { getErrorMessage } from 'lib/utils/getErrorMessage'
import { ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

const TODO_NOT_FOUND_ERROR_MSG = 'Todo not found'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req
  const { id } = query as { id: string }

  switch (method) {
    case 'PUT':
      try {
        const todos = await initdb<InsertTodoItem>(COLLECTIONS.TODOS)

        const query = { _id: new ObjectId(id) }
        const result = await todos.updateOne(query, { $set: body })

        console.log(result)

        if (result.modifiedCount <= 0) {
          res.status(400).send({ message: TODO_NOT_FOUND_ERROR_MSG })
          return
        }

        res.status(200).json({})
      } catch (err) {
        console.error(err)
        res.status(500).send({ message: getErrorMessage(err) })
      }

      break
    case 'DELETE':
      try {
        const todos = await initdb<InsertTodoItem>(COLLECTIONS.TODOS)

        const result = await todos.deleteOne({
          _id: new ObjectId(id),
        })

        if (result.deletedCount <= 0) {
          res.status(400).send({ message: TODO_NOT_FOUND_ERROR_MSG })
          return
        }

        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(500).send({ message: getErrorMessage(err) })
      }

      break
    default:
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
