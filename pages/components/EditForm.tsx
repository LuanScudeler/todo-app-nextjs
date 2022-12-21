import { useStore } from 'lib/appContext'
import { Back, Save } from 'lib/icons'
import { Dispatch, SetStateAction } from 'react'

export const EditForm = ({
  handleEditSubmit,
  todoEditingTitle,
  setTodoEditingTitle,
  todoItem,
  setTodoEditingId,
}: EditFormProps) => {
  const phrases = useStore((state) => state.phrases)

  return (
    <>
      <form
        onSubmit={handleEditSubmit}
        className="flex grow min-w-0"
        id="edit-todo-form"
      >
        <input
          className="grow outline-none min-w-0"
          id="todo-edit-title"
          name="todo_edit_title"
          value={todoEditingTitle ?? todoItem.title}
          onChange={(e) => setTodoEditingTitle(e.target.value)}
          required
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
        <button
          className="ml-4 mr-1"
          form="edit-todo-form"
          type="submit"
          title={phrases.saveEditTodoLabel}
          aria-label={phrases.saveEditTodoLabel}
        >
          <Save size={17} />
        </button>
      </form>
      <button
        className="ml-4"
        type="button"
        title={phrases.cancelEditTodoLabel}
        aria-label={phrases.cancelEditTodoLabel}
        onClick={() => {
          setTodoEditingId('')
          setTodoEditingTitle(null)
        }}
      >
        <Back size={19} />
      </button>
    </>
  )
}

interface EditFormProps {
  handleEditSubmit: (e: React.SyntheticEvent) => Promise<void>
  todoEditingTitle: string | null | undefined
  setTodoEditingTitle: Dispatch<SetStateAction<string | null | undefined>>
  todoItem: TodoItem
  setTodoEditingId: Dispatch<SetStateAction<string | undefined>>
}
