import classNames from 'classnames'
import { useField, useFormikContext } from 'formik'
import { ratingColors } from '../../data/ratingColors'

const RatingButtons = ({ ...props }) => {
  const [field] = useField(props)
  const { setFieldValue } = useFormikContext()

  const handleClick = (rate) => {
    setFieldValue(field.name, rate)
  }
  return (
    <div className='flex px-2'>
      {[...Array(11)].map((_, i) => (
        <button
          key={i}
          style={{
            width: `${(1 / 11) * 100}%`,
            backgroundColor: i === field.value && ratingColors[field.value],
          }}
          className={classNames(
            'border-gray-300 h-10 select-none flex items-center justify-center text-lg font-bold transition duration-200',
            {
              'text-gray-600 border-y-2': i !== field.value,
              'rounded-l-md border-l-2': i === 0 && i !== field.value,
              'border-r': i !== 10 && i !== field.value,
              'rounded-r-md border-r-2': i === 10 && i !== field.value,
              'transform scale-110 border-y-none shadow-lg border-r-none rounded-lg outline outline-gray-400 z-10':
                i === field.value,
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
