import { Image as CloudinaryImage } from 'cloudinary-react'
import NextImage from 'next/image'
import { Image as ImageIcon, MapPin } from 'react-feather'
import classNames from 'classnames'

const Image = ({ publicId, alt, ...props }) => {
  if (!publicId) {
    return <ImageIcon className={classNames('text-gray-300', props.className)} alt='placeholder' />
  }

  return (
    <CloudinaryImage cloudName={process.env.CLOUD_NAME} publicId={publicId} alt={alt} {...props} />
  )
}

export { Image }
