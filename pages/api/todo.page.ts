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
      let result
      try {
        const todos = await initdb<InsertTodoItem>(COLLECTIONS.TODOS)

        result = await todos.insertOne({
          title: body.title,
          timestamp: new Date(),
        })
      } catch (err) {
        console.error(err)
        res.status(500).send({ message: getErrorMessage(err) })
      }

      res.status(200).json(result)

      break
    default:
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
