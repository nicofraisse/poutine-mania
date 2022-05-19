import classNames from 'classnames'
import Input from 'components/Input'
import { Field as FormikField } from 'formik'
import { startCase } from 'lodash'

const Field = ({ name, type = 'text', className, control, label, hideLabel, hidden, ...props }) => {
  const Control = control || Input

  return (
    <FormikField name={name}>
      {({ field }) => {
        return (
          <div className={classNames(className, 'mb-3', { hidden })}>
            {!hideLabel && (
              <label htmlFor={name} className='block mb-1 font-bold text-sm'>
                {label || startCase(name)}
              </label>
            )}

            <Control
              placeholder={label || startCase(name)}
              type={type}
              id={name}
              {...field}
              {...props}
            />
          </div>
        )
      }}
    </FormikField>
  )
}

export default Field
