import useSWR from 'swr'  
import { uuid } from '../lib/utils/uuid'
import { fetcher, post } from './api'

export const useTodos = () => {
  const {
    data,
    error,
    mutate: mutateTodos,
  } = useSWR<TodoItem[], Error>('/api/todos', fetcher)

  const mutate = async (todoItem: CreateTodoItem) =>  {
    const todoItems = data || []
    const optimisticData = [...todoItems, { id: parseInt(uuid()), title: todoItem.title}]
    let error;

    try {
      await mutateTodos(createTodo(todoItem, optimisticData), {
        optimisticData,
        rollbackOnError: true,
      })
    } catch (err) {
      error = 'Unknown Error'
      if (err instanceof Error) error = err.message
    }

    return {
      error
    }
  }

  return {
    data,
    isLoading: !error && !data,
    isError: !!error,
    mutate,
  }
}

export const createTodo = async (
  body: CreateTodoItem,
  optimisticData: TodoItem[]
) => {
  await post('/api/todo', body)
  return optimisticData
}
