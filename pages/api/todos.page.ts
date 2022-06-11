// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoItem[]>
) {
  // res.status(400).end()

  res.status(200).json([
    { id: 1, title: 'todo 1' },
    { id: 2, title: 'todo 2' },
    { id: 3, title: 'todo 3' },
    { id: 4, title: 'todo 4' },
    { id: 5, title: 'todo 5' },
    { id: 6, title: 'todo 6' },
  ])
}
