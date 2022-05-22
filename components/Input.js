import classNames from 'classnames'
import { lowerCase } from 'lodash'
import { Search } from 'react-feather'

const Input = ({ className, value, type, isSearch, ...props }) => {
  const placeholder = props.placeholder || `Enter ${lowerCase(props.name)} here`
  if (type === 'textarea') {
    return (
      <textarea
        value={value || ''}
        className='border-2 border-gray-300 rounded-md py-[8px] px-2 text-sm w-full h-[120px]'
        placeholder={placeholder}
        {...props}
      />
    )
  }
  if (isSearch) {
    return (
      <div className='relative w-full'>
        <input
          type={type}
          value={value || ''}
          className='border-2 border-gray-300 rounded-md py-[8px] px-2 text-sm w-full'
          placeholder={placeholder}
          {...props}
        />
        <Search className='absolute top-2 right-2 text-gray-400' />
      </div>
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
