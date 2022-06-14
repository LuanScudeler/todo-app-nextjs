import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { todosResponseMock } from 'mocks/handlers'
import { server } from 'mocks/server'
import { SWRConfig } from 'swr'
import * as api from '../pages/api'
import Home, { phrases } from './index.page'

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

  it('renders create todo error message', async () => {
    server.use(
      rest.post('/api/todo', (req, res, { json, status }) => {
        return res.once(status(500))
      })
    )

    const { user, debug } = setupTest()

    const todoInputField = screen.getByRole('textbox', {
      name: phrases.todoTitleLabel,
    })

    user.pointer({ target: todoInputField, keys: '[MouseLeft]' })
    user.keyboard('Todo test')
    user.keyboard('[Enter]')

    expect(
      await screen.findByText(phrases.createTodoErrorText)
    ).toBeInTheDocument()
  })
})
