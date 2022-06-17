interface TodoItem {
  title: string
  timestamp: string
}

type CreateTodoItem = Omit<TodoItem, 'timestamp'>
