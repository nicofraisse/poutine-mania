import classNames from 'classnames'
import React from 'react'
import Spinner from './Spinner'

const Button = ({ children, className, variant = 'primary', size = 'lg', loading, ...props }) => {
  return (
    <button
      className={classNames(
        'rounded-md font-bold text-white flex items-center justify-center select-none',
        {
          'w-full px-8': ['primary', 'secondary'].includes(variant),
          'bg-indigo-600 h-[56px]': variant === 'primary',
          'opacity-80': loading,
          'px-3 h-[40px] text-sm': size === 'sm',
          'bg-none border-2 border-indigo-600 text-indigo-600': variant === 'secondary',
          'text-md text-gray-500 hover:bg-gray-100 p-2 rounded-lg': variant === 'light',
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
