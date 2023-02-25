import { getErrorMessage } from 'lib/utils/getErrorMessage'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher, post } from './api'
import { initMutateFunctions } from './initMutateFunctions'

const todoKeys = {
  all: ['todos'],
}

export const useTodos = () => {
  const mutateTodos = (
    promise: () => Promise<TodoItem[]>,
    {}
  ): TodoItem[] | undefined => undefined

  const { data, isError, isLoading } = useQuery<TodoItem[], any>(
    todoKeys.all,
    () => fetcher('/api/todos')
  )

  const { updateMutation, deleteMutation } = initMutateFunctions(null, null)

  return {
    data,
    isLoading,
    isError,
    useCreateMutation,
    mutate: {
      update: updateMutation,
      delete: deleteMutation,
    },
  }
}

export const useCreateMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, CreateTodoItem>(createTodo, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(todoKeys.all)
    },
  })
}

const createTodo = async (body: CreateTodoItem) => post('/api/todo', body)
