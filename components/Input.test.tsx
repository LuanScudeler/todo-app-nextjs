import { render, screen } from '@testing-library/react'
import { InputWithLabel } from './Input.stories'

describe('Input', () => {
  it('renders with label', async () => {
    render(
      <InputWithLabel
        {...InputWithLabel.args}
        onChange={() => {}}
        type="text"
      />
    )

    const label = screen.getByText(InputWithLabel.args?.label!)
    expect(label).toBeInTheDocument()
  })
})
