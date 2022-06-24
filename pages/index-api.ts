import { getErrorMessage } from 'lib/utils/getErrorMessage'
import { uuid } from 'lib/utils/uuid'
import useSWR from 'swr'
import { fetcher, post, remove } from './api'

type MutationReturn = Promise<{
  error: string
  result: TodoItem[] | undefined
}>

type MutationCall = (
  mutatorCallback: () => Promise<TodoItem[]>,
  optimisticData: TodoItem[]
) => MutationReturn

export const useTodos = () => {
  const {
    data,
    error,
    mutate: mutateTodos,
  } = useSWR<TodoItem[], Error>('/api/todos', fetcher)

  const todoItems = data || []

  const callMutation = async (
    mutatorCallback: () => Promise<TodoItem[]>,
    optimisticData: TodoItem[]
  ): MutationReturn => {
    let error = ''
    let result

    try {
      result = await mutateTodos(mutatorCallback, {
        optimisticData,
        rollbackOnError: true,
      })
    } catch (err) {
      error = getErrorMessage(err)
      console.error(error)
    }

    return {
      error,
      result,
    }
  }

  const { createMutation, deleteMutation } = initialiseMutateFunctions(
    todoItems,
    callMutation
  )

  return {
    data,
    isLoading: !error && !data,
    isError: !!error,
    mutate: {
      create: createMutation,
      delete: deleteMutation,
    },
  }
}

const initialiseMutateFunctions = (
  todoItems: TodoItem[],
  callMutation: MutationCall
) => {
  const createMutation = async (todoItem: CreateTodoItem) => {
    const optimisticData = [
      ...todoItems,
      {
        timestamp: new Date().toISOString(),
        title: todoItem.title,
        _id: uuid(),
      },
    ]

    return callMutation(
      async () => createTodo(todoItem, optimisticData),
      optimisticData
    )
  }

  const deleteMutation = (id: string) => {
    const optimisticData = todoItems.filter((todo) => todo._id !== id)

    return callMutation(
      async () => deleteTodo(id, optimisticData),
      optimisticData
    )
  }

  return {
    createMutation,
    deleteMutation,
  }
}

const createTodo = async (body: CreateTodoItem, optimisticData: TodoItem[]) => {
  await post('/api/todo', body)

  return optimisticData
}

const deleteTodo = async (id: string, optimisticData: TodoItem[]) => {
  await remove(`/api/todo/${id}`)

  return optimisticData
}
