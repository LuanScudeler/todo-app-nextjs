import type { NextApiRequest, NextApiResponse } from 'next'
import { title } from 'process';
import db, { DBData } from "../../lib/lowdb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    body,
  } = req

  switch (method) {
    case 'POST':
      const dbInstance = await db;
      
      dbInstance.data?.todoItems.push(autoIncrementId(body, dbInstance.data))
      await dbInstance.write()
      res.status(200).json({})
      
      break
    default:
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

const autoIncrementId = (bodyObj: CreateTodoItem, dbData: DBData ): TodoItem => {
  const itemsLength = dbData.todoItems.length

  return {
    id: itemsLength ? dbData.todoItems[itemsLength - 1].id + 1 : 0,
    title: bodyObj.title
  }
}