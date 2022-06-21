import { getErrorMessage } from 'lib/utils/getErrorMessage'
import useSWR from 'swr'
import { fetcher, post } from './api'

export const useTodos = () => {
  const {
    data,
    error,
    mutate: mutateTodos,
  } = useSWR<TodoItem[], Error>('/api/todos', fetcher)

  const mutate = async (todoItem: CreateTodoItem) => {
    const todoItems = data || []
    const optimisticData = [
      ...todoItems,
      { timestamp: new Date().toISOString(), title: todoItem.title },
    ]
    let error = ''

    try {
      await mutateTodos(createTodo(todoItem, optimisticData), {
        optimisticData,
        rollbackOnError: true,
      })
    } catch (err) {
      error = getErrorMessage(err)
      console.error(error)
    }

    return {
      error,
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
