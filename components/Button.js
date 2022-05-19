import classNames from 'classnames'
import React from 'react'
import Spinner from './Spinner'

const Button = ({ children, className, variant, loading, ...props }) => {
  return (
    <button
      className={classNames(
        'block w-full border rounded-md h-[56px] px-8 font-bold text-white flex items-center justify-center',
        {
          'bg-indigo-600': variant === 'primary',
          'opacity-80': loading,
        },
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}

export default Button
