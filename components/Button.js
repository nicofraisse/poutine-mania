import classNames from 'classnames'
import React from 'react'
import Spinner from './Spinner'

const Button = ({ children, className, variant = 'primary', size = 'lg', loading, ...props }) => {
  return (
    <button
      className={classNames(
        'rounded-md font-bold flex items-center justify-center select-none',
        {
          'px-8': ['primary', 'secondary'].includes(variant),
          'bg-teal-600 h-[56px]': variant === 'primary',
          'text-white': variant !== 'light',
          'opacity-80': loading,
          'px-3 lg:px-3 h-[40px] text-sm': size === 'sm',
          'bg-none border-2 border-teal-600 text-teal-600': variant === 'secondary',
          'bg-none border-none border-teal-600 text-teal-600': variant === 'noBorder',
          'text-md border-2 border-gray-100 text-gray-500 bg-gray-100 hover:bg-gray-200 lg:p-2 rounded-lg':
            variant === 'light',
        },
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? <Spinner color='#fff' /> : children}
    </button>
  )
}

export default Button
