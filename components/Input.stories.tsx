import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Input } from './Input'

export default {
  component: Input,
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />

export const InputWithLabel = Template.bind({})

InputWithLabel.args = {
  label: 'Name',
  type: 'text',
}
