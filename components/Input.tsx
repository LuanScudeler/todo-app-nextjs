import { HTMLInputTypeAttribute, useId } from 'react'

export const Input = (props: InputProps) => {
  const { label, onChange, type, value, name } = props
  const id = useId()

  return (
    <div
      className={
        'flex flex-1 py-8 border-solid border-t border-t-indigo-50 justify-center items-center'
      }
    >
      <label htmlFor={id} className="font-semibold leading-loose">
        {label}
      </label>
      <input
        className="h-12 w-full border px-4 block mb-4"
        type={type}
        id={id}
        name={name}
        placeholder="type a new todo"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  )
}

interface InputProps {
  label: string
  name?: string
  onChange: (value: string) => void
  type: HTMLInputTypeAttribute
  value: string | number
}
