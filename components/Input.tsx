import { HTMLInputTypeAttribute, useId } from 'react'

export const Input = (props: InputProps) => {
  const { label, name, onChange, placeholder, type, value } = props
  const id = useId()

  return (
    <div>
      {label && (
        <label htmlFor={id} className="font-semibold leading-loose">
          {label}
        </label>
      )}
      <input
        className="h-12 w-full border px-4 block mb-4"
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  )
}

interface InputProps {
  label?: string
  name?: string
  onChange: (value: string) => void
  placeholder?: string
  type: HTMLInputTypeAttribute
  value?: string | number
}
