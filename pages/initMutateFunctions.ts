import { uuid } from 'lib/utils/uuid'
import { useMutation } from '@tanstack/react-query'
import { post, put, remove } from './api'

type MutationCall = (
  mutatorCallback: () => Promise<TodoItem[]>,
  optimisticData: TodoItem[]
) => MutationReturn

export const initMutateFunctions = (
  todoItems: TodoItem[],
  callMutation: MutationCall
) => {
  const updateMutation = async (todoItem: UpdateTodoItem) => {
    const optimisticData = [...todoItems]
    const updateIndex = optimisticData.findIndex(
      (todo) => todo._id === todoItem._id
    )

    if (updateIndex === -1) throw new Error()

    optimisticData[updateIndex] = {
      timestamp: new Date().toISOString(),
      title: todoItem.title,
      _id: todoItem._id,
    }

    return callMutation(
      async () => updateTodo(todoItem, optimisticData),
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
    updateMutation,
    deleteMutation,
  }
}

const updateTodo = async (body: UpdateTodoItem, optimisticData: TodoItem[]) => {
  await put(`/api/todo/${body._id}`, { title: body.title })

  return optimisticData
}

const deleteTodo = async (id: string, optimisticData: TodoItem[]) => {
  await remove(`/api/todo/${id}`)

  return optimisticData
}
