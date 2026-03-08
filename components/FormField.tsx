import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'

interface FormFieldProps<T extends FieldValues>{
  control: Control<T>,
  name: Path<T>,
  label:string,
  placeholder?: string,
  type?: "text" | "email" | "password"
}

const FormField = <T extends FieldValues>({name, placeholder, label, type="text", control}: FormFieldProps<T>) => {
  return (
    <div>
       <Controller
              name={name}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title" className="label">
                    {label}
                  </FieldLabel>
                  <Input
                  className='input'
                    {...field}
                    type={type}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder={placeholder}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            /> 
    </div>
  )
}

export default FormField
