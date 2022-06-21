import { connectMongo } from './mongodb'

export const COLLECTIONS = {
  TODOS: 'todos',
}

export const initdb = async <T>(collection: string) => {
  const client = await connectMongo()
  const db = client.db('nextjs_app_db')

  return db.collection<T>(collection)
}
