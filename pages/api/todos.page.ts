import type { NextApiRequest, NextApiResponse } from 'next'
import db from "../../lib/lowdb"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoItem[]>
) {
  const { data } = await db;
  
  res.status(200).json(data?.todoItems || [])
}
