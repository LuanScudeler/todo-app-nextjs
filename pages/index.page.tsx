import { Close, Pencil, Save } from 'lib/icons'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useMemo, useState } from 'react'
import { Footer } from '../components/Footer'
import { useTodos } from './index-api'

export const phrases = {
  loadingText: 'Loading...',
  titleText: 'Todo Next App',
  todoTitleLabel: 'Todo title',
  fetchTodoErrorText: 'Failed to fetch todos',
  createTodoErrorText: 'Failed to create todo',
  updateTodoErrorText: 'Failed to update todo',
  deleteTodoErrorText: 'Failed to delete todo. Please try again.',
  deleteTodoLabel: 'Delete todo',
  editTodoLabel: 'Edit todo',
  saveEditTodoLabel: 'Save edit',
  cancelEditTodoLabel: 'Cancel edit',
}

const CONTAINERS_WIDTH = 'w-11/12 sm:w-10/12 lg:w-6/12'

const Home: NextPage = () => {
  const [todoTitle, setTodoTitle] = useState<string>('')
  const [todoEditingTitle, setTodoEditingTitle] = useState<string | null>()
  const [mutationError, setMutationError] = useState<string>()
  const [todoEditingId, setTodoEditingId] = useState<string>()

  const {
    data: todoItems = [],
    isLoading,
    isError: isFetchError,
    mutate,
  } = useTodos()

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    setTodoTitle('')

    const { error } = await mutate.create({ title: todoTitle })
    error
      ? setMutationError(phrases.createTodoErrorText)
      : setMutationError(undefined)
  }

  const handleEditSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!todoEditingTitle) {
      setTodoEditingId('')
      return
    }

    setTodoEditingId('')
    setTodoEditingTitle(null)

    const { error } = await mutate.update({
      title: todoEditingTitle,
      _id: todoEditingId!,
    })

    error
      ? setMutationError(phrases.updateTodoErrorText)
      : setMutationError(undefined)
  }

  const handleDelete = async (id: string) => {
    const { error } = await mutate.delete(id)

    error
      ? setMutationError(phrases.deleteTodoErrorText)
      : setMutationError(undefined)
  }

  const dynamicStyles = useMemo(() => {
    if (todoEditingId) {
      return {
        titleColor: 'text-gray-300',
        svgFill: 'fill-gray-300',
      }
    }

    return {
      titleColor: 'text-inherit',
      svgFill: 'fill-inherit',
    }
  }, [todoEditingId])

  return (
    <div className="px-8">
      <Head>
        <title>{phrases.titleText}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-16 flex flex-col items-center :">
        <h1 className="mb-8 text-3xl sm:text-5xl lg:text-6xl ">
          {phrases.titleText}
        </h1>
        <div
          className={`flex flex-col justify-center items-center ${CONTAINERS_WIDTH}`}
        >
          <span className="text-red-600">
            {isFetchError && phrases.fetchTodoErrorText}
            {mutationError}
          </span>
          <span className="text-neutral-900">
            {isLoading && phrases.loadingText}
          </span>
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
        {todoItems.length > 0 && (
          <ul
            className={`shadow-xl border border-gray-200 ${CONTAINERS_WIDTH}`}
          >
            {todoItems.map((todoItem) => (
              <li
                key={todoItem._id}
                className={`flex bg-white p-4 border-b border-gray-200 ${
                  todoItem._id === todoEditingId ? 'highlight-shadow' : ''
                }`}
              >
                {todoItem._id === todoEditingId ? (
                  <>
                    <form
                      onSubmit={handleEditSubmit}
                      className="flex grow min-w-0 "
                      id="edit-todo-form"
                    >
                      <input
                        className="grow outline-none"
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
                        aria-label={phrases.deleteTodoLabel}
                      >
                        <Save size={17} />
                      </button>
                    </form>

                    <button
                      className="ml-4"
                      type="button"
                      title={phrases.cancelEditTodoLabel}
                      aria-label={phrases.deleteTodoLabel}
                      onClick={() => {
                        setTodoEditingId('')
                        setTodoEditingTitle(null)
                      }}
                    >
                      <Close size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className={`${dynamicStyles.titleColor} grow break-all`}
                    >
                      {todoItem.title}
                    </span>
                    <button
                      className={`ml-4 mr-1`}
                      type="button"
                      title={phrases.editTodoLabel}
                      aria-label={phrases.editTodoLabel}
                      onClick={() => setTodoEditingId(todoItem._id)}
                      disabled={!!todoEditingId}
                    >
                      <Pencil
                        className={`${dynamicStyles.svgFill}`}
                        size={17}
                      />
                    </button>
                    <button
                      className="ml-4 fill"
                      type="button"
                      title={phrases.deleteTodoLabel}
                      aria-label={phrases.deleteTodoLabel}
                      onClick={() => handleDelete(todoItem._id)}
                      disabled={!!todoEditingId}
                    >
                      <Close className={`${dynamicStyles.svgFill}`} size={16} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Home
