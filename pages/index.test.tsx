/* eslint-disable testing-library/prefer-screen-queries */
import {
  BoundFunctions,
  Queries,
  render,
  screen,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { todosResponseMock } from 'mocks/handlers'
import { server } from 'mocks/server'
import { SWRConfig } from 'swr'
import * as api from '../pages/api'
import Home from './index.page'
import { UserEvent } from '@testing-library/user-event/dist/types/setup'
import { phrases } from 'lib/phrases'
import { AppContext } from 'lib/appContext'

describe('Todo app', () => {
  const setupTest = () => {
    return {
      user: userEvent.setup(),
      ...render(
        <AppContext.Provider value={{ phrases: phrases }}>
          <SWRConfig value={{ provider: () => new Map() }}>
            <Home />
          </SWRConfig>
        </AppContext.Provider>
      ),
    }
  }

  describe('fetch todos', () => {
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
  })

  describe('create todos', () => {
    it('creates a new todo successfully', async () => {
      const { user } = setupTest()
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

      const { user } = setupTest()
      submitNewTodo(user, 'Todo test')

      expect(
        await screen.findByText(phrases.createTodoErrorText)
      ).toBeInTheDocument()
    })
  })

  describe('delete todos', () => {
    it('deletes a todo successfully', async () => {
      const { user } = setupTest()

      const { deletedTodoMock } = await deleteTodoFirstInList(user)

      expect(screen.queryByText(deletedTodoMock.title)).not.toBeInTheDocument()
    })

    it('renders delete todo error message', async () => {
      server.use(
        rest.delete('/api/todo/:id', (req, res, { json, status }) => {
          return res.once(status(500))
        })
      )

      const { user } = setupTest()
      await deleteTodoFirstInList(user)

      expect(
        await screen.findByText(phrases.deleteTodoErrorText)
      ).toBeInTheDocument()
    })
  })

  describe('edit todos', () => {
    it('displays edit mode', async () => {
      const { user } = setupTest()
      const { renderResult: todoElement } = await getTodoElement(0)

      await enterEditMode(user, todoElement)

      expect(
        screen.getByRole('button', { name: phrases.saveEditTodoLabel })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: phrases.cancelEditTodoLabel })
      ).toBeInTheDocument()
      expect(todoElement.getByRole('textbox')).toBeInTheDocument()
    })

    it('disables actions on todos that are not on edit mode', async () => {
      const { user } = setupTest()
      const { renderResult: todoElement } = await getTodoElement(0)

      await enterEditMode(user, todoElement)

      const { renderResult: noEditModeTodoElement } = await getTodoElement(1)
      expect(
        noEditModeTodoElement.getByRole('button', {
          name: phrases.editTodoLabel,
        })
      ).toBeDisabled()
      expect(
        noEditModeTodoElement.getByRole('button', {
          name: phrases.deleteTodoLabel,
        })
      ).toBeDisabled()
    })
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
  const { renderResult, todoData } = await getTodoElement(0)
  const deleteButton = renderResult.getByRole('button', {
    name: phrases.deleteTodoLabel,
  })

  user.pointer({ target: deleteButton, keys: '[MouseLeft]' })

  return { deletedTodoMock: todoData }
}

const enterEditMode = async (
  user: UserEvent,
  todoElement: BoundFunctions<Queries>
) => {
  const editButton = todoElement.getByRole('button', {
    name: phrases.editTodoLabel,
  })

  await user.pointer({ target: editButton as Element, keys: '[MouseLeft]' })
}

const getTodoElement = async (todoIndex: number) => {
  const todoItems = await screen.findAllByRole('listitem')

  return {
    renderResult: within(todoItems[todoIndex]),
    todoData: todosResponseMock[todoIndex],
  }
}
