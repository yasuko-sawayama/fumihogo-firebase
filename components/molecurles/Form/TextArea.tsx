import { forwardRef } from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import FormErrorText from './FormErrorText'

const TextArea = forwardRef<
  HTMLTextAreaElement,
  {
    label: string
    rows?: number
    defaultValue?: string
    errors: FieldErrors
  } & ReturnType<UseFormRegister<INewStoryFormValues>>
>(({ onChange, onBlur, name, label, errors, rows = 3, defaultValue }, ref) => (
  <>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 flex rounded-md shadow-sm">
      <textarea
        name={name}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
        rows={rows}
        defaultValue={defaultValue}
        className="block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
    {errors[name] && <FormErrorText>{errors[name].message}</FormErrorText>}
  </>
))

TextArea.displayName = 'TextArea'

export default TextArea
