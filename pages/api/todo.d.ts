interface TodoItem {
  title: string
  timestamp: string
  _id: string
}

type MutationReturn = Promise<{
  error: string
  result: TodoItem[] | undefined
}>

type CreateTodoItem = Omit<TodoItem, 'timestamp'>

type InsertTodoItem = CreateTodoItem & { timestamp: Date }

type UpdateTodoItem = Omit<TodoItem, 'timestamp'>
