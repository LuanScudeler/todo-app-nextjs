import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { Footer } from '../components/Footer'
import { createTodo, useTodos } from './index-api'

interface TodoForm {
  todo_title: { value: string };
}

const Home: NextPage = () => {
  const [itemTitle, setItemTitle] = useState<string>('')
  const [isMutationError, setIsMutationError] = useState<string>()
  const { data: todoItems = [], isLoading, isError: isFetchError, mutate } = useTodos()

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & TodoForm;
    const { error } = await mutate({ title: target.todo_title.value})

    setIsMutationError(error)
    setItemTitle('')
  }

  // TODO: Configure MSW
  return (
    <div className="px-8">
      <Head>
        <title>Todo Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-16 flex flex-col items-center">
        <h1 className="m-0 leading-loose text-6xl">Todo Next App</h1>
        <div>
          <span className="text-red-600">
            {isFetchError && 'Failed to fetch todos'}
            {isMutationError && 'Failed to create todo'}
          </span>
          <span className="text-neutral-900">{isLoading && 'Loading...'}</span>
          <form onSubmit={handleSubmit}>
            <label htmlFor="first" className='font-semibold leading-loose'>Todo title</label>
            <input
              type="text"
              id="todo-title"
              name="todo_title"
              className="h-8 border-2 px-4 block mb-4"
              placeholder="type a new todo"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              required
            />
          </form>
          {todoItems.map((todoItem) => (
            <div key={todoItem.id}>{todoItem.title}</div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home