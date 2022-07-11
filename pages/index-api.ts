import { getErrorMessage } from 'lib/utils/getErrorMessage'
import useSWR from 'swr'
import { fetcher } from './api'
import { initMutateFunctions } from './initMutateFunctions'

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
    }

    return {
      error,
      result,
    }
  }

  const { createMutation, updateMutation, deleteMutation } =
    initMutateFunctions(todoItems, callMutation)

  return {
    data,
    isLoading: !error && !data,
    isError: !!error,
    mutate: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
    },
  }
}
