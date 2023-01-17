import { useStore } from 'lib/appContext'
import { Dispatch, SetStateAction } from 'react'
import { CONTAINERS_WIDTH } from './TodoPage.const'

export const CreateForm = ({
  handleSubmit,
  todoTitle,
  setTodoTitle,
}: CreateFormProps) => {
  const phrases = useStore((state) => state.phrases)

  return (
    <div
      className={`flex flex-col justify-center items-center ${CONTAINERS_WIDTH}`}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <label htmlFor="todo-title" className="font-semibold leading-loose">
          {phrases.todoTitleLabel}
        </label>
        <input
          className="h-12 w-full border px-4 block mb-4"
          type="text"
          id="todo-title"
          name="todo_title"
          placeholder="type a new todo"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          required
        />
      </form>
    </div>
  )
}

interface CreateFormProps {
  handleSubmit: (e: React.SyntheticEvent) => Promise<void>
  todoTitle: string
  setTodoTitle: Dispatch<SetStateAction<string>>
}
