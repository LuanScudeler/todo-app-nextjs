import { useState } from 'react'
import useSWR from 'swr'
import { fetcher, post } from './api'

export const useTodos = () => {
  const {
    data,
    error,
    mutate: mutateTodos,
  } = useSWR<TodoItem[], Error>('/api/todos', fetcher)

  const mutate = (todoItem: TodoItem) => {
    const todoItems = data || []
    const optimisticData = [...todoItems, todoItem]
    console.log(optimisticData)
    mutateTodos(createTodo(todoItem, optimisticData), {
      optimisticData,
      rollbackOnError: true,
    })
  }

  return {
    data,
    isLoading: !error && !data,
    isError: !!error,
    mutate,
  }
}

export const createTodo = async (
  body: TodoItem,
  optimisticData: TodoItem[]
) => {
  await post('/api/todo/1', body)
  return optimisticData
}
