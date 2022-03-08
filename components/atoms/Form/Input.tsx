import { forwardRef } from "react"
import { FieldErrors, UseFormRegister } from "react-hook-form"
import FormErrorText from './FormErrorText'
import { FormValues } from './types'

const Input = forwardRef<
  HTMLInputElement,
  {
    label: string
    type?: string
    autoComplete?: string
    errors: FieldErrors
  } & ReturnType<UseFormRegister<FormValues>>
>(
  (
    { onChange, onBlur, name, type = 'text', label, autoComplete, errors },
    ref
  ) => (
    <>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          className="block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {errors[name] && <FormErrorText>{errors[name].message}</FormErrorText>}
    </>
  )
)

Input.displayName = "Input"

export default Input