interface TodoItem {
  title: string
  timestamp: string
  _id: string
}

type CreateTodoItem = Omit<TodoItem, 'timestamp' | '_id'>

type InsertTodoItem = CreateTodoItem & { timestamp: Date }
