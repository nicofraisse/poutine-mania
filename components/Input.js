import classNames from 'classnames'
import { lowerCase } from 'lodash'

const Input = ({ className, value, type, ...props }) => {
  const placeholder = props.placeholder || `Enter ${lowerCase(props.name)} here`
  if (type === 'textarea') {
    return (
      <textarea
        value={value || ''}
        className={classNames('')}
        placeholder={placeholder}
        {...props}
      />
    )
  }
  return (
    <input
      type={type}
      value={value || ''}
      className='border-2 border-gray-300 rounded-md py-[8px] px-2 text-sm w-full'
      placeholder={placeholder}
      {...props}
    />
  )
}

export default Input
