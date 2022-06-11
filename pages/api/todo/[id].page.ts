import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, name },
    method,
  } = req

  switch (method) {
    case 'POST':
      setTimeout(() => res.status(200).json({}), 2000)
      break
    case 'PUT':
      res.status(200).json({})
      break
    default:
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
