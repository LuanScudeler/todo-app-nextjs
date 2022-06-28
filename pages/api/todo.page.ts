import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorMessage } from 'lib/utils/getErrorMessage'
import { COLLECTIONS, initdb } from 'lib/initdb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req

  switch (method) {
    case 'POST':
      try {
        const todos = await initdb<InsertTodoItem>(COLLECTIONS.TODOS)

        const result = await todos.insertOne({
          _id: body._id,
          title: body.title,
          timestamp: new Date(),
        })

        res.status(200).json(result)
      } catch (err) {
        console.error(err)
        res.status(500).send({ message: getErrorMessage(err) })
      }

      break
    default:
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
