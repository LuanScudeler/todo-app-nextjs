import '@testing-library/jest-dom/extend-expect'
import { server } from './mocks/server'
import { setGlobalConfig } from '@storybook/testing-react';

// Storybook's preview file location
import * as globalStorybookConfig from './.storybook/preview';

require('whatwg-fetch')

setGlobalConfig(globalStorybookConfig);

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})
