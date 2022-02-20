import { forwardRef } from "react"
import { FieldErrors, UseFormRegister } from "react-hook-form"
import FormErrorText from "./FormErrorText"

const Input = forwardRef<
  HTMLInputElement,
  { label: string, type?: string, autoComplete?: string, errors: FieldErrors } & ReturnType<UseFormRegister<INewStoryFormValues>>
  >(({ onChange, onBlur, name, type="text", label, autoComplete, errors }, ref) => (

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
          className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
        />
    </div>
    {errors[name] && <FormErrorText>{errors[name].message}</FormErrorText>}
  </>
  ))

Input.displayName = "Input"

export default Input