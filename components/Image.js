import { Image as CloudinaryImage } from "cloudinary-react";
import NextImage from "next/image";
import { Image as ImageIcon, MapPin } from "react-feather";
import classNames from "classnames";

const Image = ({ alt, src, ...props }) => {
  if (src && !src.includes("http"))
    return (
      <CloudinaryImage
        cloudName={process.env.CLOUD_NAME}
        publicId={src}
        alt={alt}
        {...props}
      />
    );
  return (
    <ImageIcon
      className={classNames("text-gray-300", props.className)}
      alt="placeholder"
    />
  );
};

export { Image };
