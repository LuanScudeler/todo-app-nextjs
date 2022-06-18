interface TodoItem {
  title: string
  timestamp: string
}

type InsertTodoItem = Omit<TodoItem, 'timestamp'> & { timestamp: Date }

type CreateTodoItem = Omit<TodoItem, 'timestamp'>
