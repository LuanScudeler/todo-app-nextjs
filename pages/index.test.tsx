import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { todosResponseMock } from 'mocks/handlers'
import { server } from 'mocks/server'
import { SWRConfig } from 'swr'
import * as api from '../pages/api'
import Home, { phrases } from './index.page'
import { UserEvent } from '@testing-library/user-event/dist/types/setup'

describe('Home', () => {
  const setupTest = () => {
    return {
      user: userEvent.setup(),
      ...render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <Home />
        </SWRConfig>
      ),
    }
  }

  it('renders home page', async () => {
    setupTest()

    const heading = screen.getByRole('heading', {
      name: phrases.titleText,
    })
    const todoInputField = screen.getByRole('textbox', {
      name: phrases.todoTitleLabel,
    })

    expect(heading).toBeInTheDocument()
    expect(todoInputField).toBeInTheDocument()
  })

  it('renders list of todos', async () => {
    setupTest()

    expect(await screen.findByRole('list')).toBeInTheDocument()
    expect(await screen.findAllByRole('listitem')).toHaveLength(
      todosResponseMock.length
    )
  })

  it('renders loading indicator', async () => {
    jest.spyOn(api, 'fetcher').mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(''), 9999)
      })
    })

    setupTest()

    expect(await screen.findByText(phrases.loadingText)).toBeInTheDocument()
  })

  it('renders fetch error message', async () => {
    server.use(
      rest.get('/api/todos', (req, res, { json, status }) => {
        return res.once(status(500))
      })
    )

    setupTest()

    expect(
      await screen.findByText(phrases.fetchTodoErrorText)
    ).toBeInTheDocument()
  })

  it('creates a new todo successfully', async () => {
    const { user, debug } = setupTest()
    const newTodoTitle = 'Todo test'

    submitNewTodo(user, newTodoTitle)

    expect(await screen.findByText(newTodoTitle)).toBeInTheDocument()
  })

  it('renders create todo error message', async () => {
    server.use(
      rest.post('/api/todo', (req, res, { json, status }) => {
        return res.once(status(500))
      })
    )

    const { user, debug } = setupTest()
    submitNewTodo(user, 'Todo test')

    expect(
      await screen.findByText(phrases.createTodoErrorText)
    ).toBeInTheDocument()
  })

  it('deletes a todo successfully', async () => {
    const { user, debug } = setupTest()

    const { deletedTodoMock } = await deleteTodoFirstInList(user)

    expect(screen.queryByText(deletedTodoMock.title)).not.toBeInTheDocument()
  })

  it('renders delete todo error message', async () => {
    server.use(
      rest.delete('/api/todo/:id', (req, res, { json, status }) => {
        return res.once(status(500))
      })
    )

    const { user, debug } = setupTest()
    await deleteTodoFirstInList(user)

    expect(
      await screen.findByText(phrases.deleteTodoErrorText)
    ).toBeInTheDocument()
  })
})

const submitNewTodo = (user: UserEvent, newTodoTitle: string) => {
  const todoInputField = screen.getByRole('textbox', {
    name: phrases.todoTitleLabel,
  })

  user.pointer({ target: todoInputField, keys: '[MouseLeft]' })
  user.keyboard(`${newTodoTitle}{enter}`)
}

const deleteTodoFirstInList = async (user: UserEvent) => {
  const todoIndex = 0
  const todoMock = todosResponseMock[todoIndex]
  const todoItems = await screen.findAllByRole('listitem')

  const { getByRole } = within(todoItems[todoIndex])
  const deleteButton = getByRole('button', {
    name: phrases.deleteTodoLabel,
  })

  user.pointer({ target: deleteButton, keys: '[MouseLeft]' })

  return { deletedTodoMock: todoMock }
}
