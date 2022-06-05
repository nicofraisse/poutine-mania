import { Image as CloudinaryImage } from 'cloudinary-react'
import NextImage from 'next/image'

const Image = ({ publicId, alt, ...props }) => {
  if (!publicId) {
    // return <NextImage src='/images/sample.png' alt='sample' {...props} />
    return <div className='p-3 border'>No image</div>
  }

  console.log(process.env.MONGO_URI)
  return (
    <CloudinaryImage cloudName={process.env.CLOUD_NAME} publicId={publicId} alt={alt} {...props} />
  )
}

export { Image }
