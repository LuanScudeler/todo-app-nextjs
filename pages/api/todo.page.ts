import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
  } = req

  switch (method) {
    case 'POST':
      // Add delay to visualize SWR optmistic UI update
      setTimeout(() => res.status(200).json({}), 2000)
      // res.status(500).end(`Method ${method} Not Allowed`)
      break
    default:
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
