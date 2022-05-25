import classNames from 'classnames'
import { lowerCase } from 'lodash'
import { Search } from 'react-feather'

const Input = ({ className, value, type, isSearch, ...props }) => {
  const placeholder = props.placeholder || `Enter ${lowerCase(props.name)} here`
  if (type === 'textarea') {
    return (
      <textarea
        className='border-2 border-gray-300 rounded-md py-[8px] px-2 text-sm w-full h-[120px]'
        placeholder={placeholder}
        defaultValue={value}
        {...props}
      />
    )
  }
  if (isSearch) {
    return (
      <div className={classNames('relative', className)}>
        <input
          type={type}
          className='border-2 border-gray-300 rounded-md py-[8px] px-2 text-sm w-full'
          placeholder={placeholder}
          defaultValue={value}
          {...props}
        />
        <Search className='absolute top-2 right-2 text-gray-400' />
      </div>
    )
  }

  return (
    <input
      type={type}
      className='border-2 border-gray-300 rounded-md py-[8px] px-2 text-sm w-full truncate break-all'
      placeholder={placeholder}
      defaultValue={value}
      {...props}
    />
  )
}

export default Input
