import { useRef, useState } from 'react'
import { Image } from 'components/Image'
import { Camera, Trash } from 'react-feather'
import { useField, useFormikContext } from 'formik'

const ImageUpload = ({ onChange, ...props }) => {
  const [imageSrc, setImageSrc] = useState()
  const [field] = useField(props)
  const { setFieldValue } = useFormikContext()

  console.log(field)

  const handleChange = (changeEvent) => {
    const reader = new FileReader()

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result)
      setFieldValue(field.name, changeEvent.target.files)
    }

    // console.log(changeEvent.target.files)

    reader.readAsDataURL(changeEvent.target.files[0])
  }

  const inputRef = useRef()
  const handleDelete = () => {
    setImageSrc(undefined)
    setFieldValue(field.name, [])
  }

  const imageExists = imageSrc || field?.value?.[0]
  return (
    <div>
      <input type='file' name='file' onChange={handleChange} hidden ref={inputRef} />
      <div type='button' className='border-2 border-gray-300 rounded-lg p-3'>
        {imageExists ? (
          <div className='relative border h-40 inline-flex'>
            {imageSrc ? (
              <>
                {/* eslint-disable-next-line */}
                <img
                  src={imageSrc}
                  alt='upload'
                  className='h-full relative flex items-center justify-center'
                ></img>
              </>
            ) : (
              <Image publicId={field?.value?.[0]} alt='existing-poutine-photo' />
            )}
            <button
              type='button'
              onClick={handleDelete}
              className='absolute top-[-10px] right-[-10px] border bg-white h-8 w-8 rounded-full hover:shadow flex items-center justify-center'
            >
              <Trash className='text-red-500' size={20} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current.click()}
            className='border-dashed border-2 border-gray-200 w-32 h-32 rounded-lg text-gray-500 flex flex-col items-center justify-center hover:bg-gray-50 transition duration-100'
          >
            <Camera /> Ajouter
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUpload
