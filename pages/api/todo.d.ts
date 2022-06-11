interface TodoItem {
  id: number
  title: string
}

type CreateTodoItem = Omit<TodoItem, "id">;