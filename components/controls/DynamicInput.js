import React from 'react'
import Input from 'components/Input'
import { MinusCircle, Plus, PlusCircle } from 'react-feather'
import { useState, useEffect } from 'react'
import { useField, useFormikContext } from 'formik'

const DynamicInput = ({ value, onChange, ...props }) => {
  const [inputs, setInputs] = useState([''])
  const [field] = useField(props)
  const { setFieldValue } = useFormikContext()

  useEffect(() => {
    setFieldValue(field.name, JSON.stringify(inputs))
  }, [inputs, field.name, setFieldValue])

  const handleChange = (e, index) => {
    const inputsCopy = [...inputs]
    inputsCopy[index] = e.target.value
    setInputs(inputsCopy)
  }

  const addInput = () => {
    const inputsCopy = [...inputs]
    inputsCopy.push('')
    setInputs(inputsCopy)
  }

  const deleteInput = (index) => {
    setInputs(inputs.filter((_, i) => i !== index))
  }

  return (
    <div>
      {inputs.map((input, index) => {
        return (
          <div key={index} className='relative'>
            <input
              value={inputs[index]}
              onChange={(e) => handleChange(e, index)}
              className='border-2 border-gray-300 rounded-md py-[8px] px-2 mb-1 text-sm w-full'
              placeholder="Entrer l'addresse ici"
            />

            {index > 0 && (
              <MinusCircle
                className='absolute right-[-28px] top-2 text-red-200 cursor-pointer hover:text-red-400'
                onClick={() => deleteInput(index)}
              />
            )}
          </div>
        )
      })}
      <div
        className='text-sm text-gray-500 flex cursor-pointer items-center mt-2 mb-5 hover:opacity-70'
        onClick={addInput}
      >
        <Plus className='mr-1' size={20} /> ajouter une autre addresse
      </div>
    </div>
  )
}

export default DynamicInput
