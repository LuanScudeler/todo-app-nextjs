import { rest } from 'msw'

export const handlers = [
  rest.get('/api/todos', (req, res, ctx) => {
    return res(ctx.json(todosResponseMock))
  }),
  rest.post('/api/todo', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]))
  }),
  rest.delete('/api/todo/:id', (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.put('/api/todo/:id', (req, res, ctx) => {
    return res(ctx.status(200))
  }),
]

export const todosResponseMock = [
  {
    _id: '0',
    title: 'todo 1',
  },
  {
    _id: '1',
    title: 'todo 2',
  },
  {
    _id: '2',
    title: 'todo 3',
  },
]
