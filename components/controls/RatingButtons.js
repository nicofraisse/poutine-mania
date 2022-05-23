import classNames from 'classnames'
import { useField, useFormikContext } from 'formik'

const RatingButtons = ({ ...props }) => {
  const [field] = useField(props)
  const { setFieldValue } = useFormikContext()

  const handleClick = (rate) => {
    setFieldValue(field.name, rate)
  }
  return (
    <div className='flex'>
      {[...Array(11)].map((_, i) => (
        <button
          key={i}
          style={{ width: `${(1 / 11) * 100}%` }}
          className={classNames(
            'border-r-2 border-y-2 border-gray-300 h-10 flex items-center justify-center text-lg font-bold',
            {
              'text-gray-600': i !== field.value,
              'bg-indigo-600 text-white': i === field.value,
              'rounded-l-md border-l-2': i === 0,
              'rounded-r-md': i === 10,
            }
          )}
          onClick={() => handleClick(i)}
          type='button'
        >
          {i}
        </button>
      ))}
    </div>
  )
}

export default RatingButtons
