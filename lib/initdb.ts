import clientPromise from './mongodb'

export const COLLECTIONS = {
  TODOS: 'todos2',
}

export const initdb = async <T>(collection: string) => {
  const client = await clientPromise
  const db = client.db('nextjs_app_db')

  return db.collection<T>(collection)
}
