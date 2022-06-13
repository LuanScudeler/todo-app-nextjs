import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

export type DBData = {
  todoItems: TodoItem[]
}

const initDB = async () => {
  const __dirname = dirname(fileURLToPath(import.meta.url))

  // Use JSON file for storage
  const file = join(__dirname, 'db.json')
  const adapter = new JSONFile<DBData>(file)
  const db = new Low(adapter)

  // Read data from JSON file, this will set db.data content
  await db.read()
  db.data = db.data || { todoItems: [] }

  return db
}

export default initDB()
