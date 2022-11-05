import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Input } from './Input'

export default {
  component: Input,
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />

const defaultArgs = { type: 'text', onChange: () => {} }

export const InputWithLabel = Template.bind({})
InputWithLabel.args = {
  ...defaultArgs,
  label: 'Name',
}

export const InputNoLabel = Template.bind({})
InputNoLabel.args = {
  ...defaultArgs,
}
