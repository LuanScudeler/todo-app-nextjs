import { rest } from 'msw'

export const handlers = [
  rest.get('/api/todos', (req, res, ctx) => {
    return res(ctx.json(todosResponseMock))
  }),
]

export const todosResponseMock = [
  {
    id: 0,
    title: 'todo 1',
  },
  {
    id: 1,
    title: 'todo 2',
  },
  {
    id: 2,
    title: 'todo 3',
  },
]
