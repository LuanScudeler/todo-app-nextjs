import { rest } from 'msw'

export const handlers = [
  rest.get('/todos', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 0,
        title: 'Lord of the Rings',
      })
    )
  }),
]
