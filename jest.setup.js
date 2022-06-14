import '@testing-library/jest-dom/extend-expect'
import { server } from './mocks/server'

require('whatwg-fetch')

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

