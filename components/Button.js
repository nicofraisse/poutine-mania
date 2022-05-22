import classNames from 'classnames'
import React from 'react'
import Spinner from './Spinner'

const Button = ({ children, className, variant = 'primary', size = 'lg', loading, ...props }) => {
  return (
    <button
      className={classNames(
        'w-full rounded-md h-[56px] px-8 font-bold text-white flex items-center justify-center',
        {
          'bg-indigo-600': variant === 'primary',
          'opacity-80': loading,
          'px-3 h-[40px] text-sm': size === 'sm',
          'bg-none border-2 border-indigo-600 text-indigo-600': variant === 'secondary',
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
