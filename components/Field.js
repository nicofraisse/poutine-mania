import classNames from 'classnames'
import Input from 'components/Input'
import { Field as FormikField } from 'formik'
import { startCase } from 'lodash'
import { useContext, useMemo } from 'react'
import toast from 'react-hot-toast'
import { FormContext } from './Form'
import { isRequiredField } from 'lib/isRequiredField'

const Field = ({ name, type = 'text', className, control, label, hideLabel, hidden, ...props }) => {
  const Control = control || Input
  const { validationSchema } = useContext(FormContext)

  const asterisk = useMemo(
    () => isRequiredField(validationSchema, name) && <span className='text-red-600 ml-1'>*</span>,
    [validationSchema, name]
  )

  return (
    <FormikField name={name}>
      {({ field, meta }) => {
        return (
          <div className={classNames(className, 'mb-3', { hidden })}>
            {!hideLabel && (
              <label htmlFor={name} className='block mb-1 font-bold text-sm text-gray-800'>
                {label || startCase(name)}
                {asterisk}
                {meta.touched && meta.error && (
                  <span className='text-red-600 ml-1 font-normal'>{meta.error}</span>
                )}
              </label>
            )}

            <Control
              placeholder={label || startCase(name)}
              type={type}
              id={name}
              {...field}
              {...props}
            />
            {/* {meta.touched && meta.error && toast.error(meta.error)} */}
          </div>
        )
      }}
    </FormikField>
  )
}

export default Field
