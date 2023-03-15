import { Image as CloudinaryImage } from "cloudinary-react";
import NextImage from "next/image";
import { Image as ImageIcon } from "react-feather";
import classNames from "classnames";

const Image = ({ alt, src, ...props }) => {
  if (src) {
    if (!src.includes("http")) {
      return (
        <CloudinaryImage
          cloudName={process.env.CLOUD_NAME}
          publicId={src}
          alt={alt}
          {...props}
        />
      );
    }
    return (
      <NextImage width="100%" height="100%" src={src} {...props} alt="image" />
    );
  }
  return (
    <ImageIcon
      className={classNames("text-gray-300", props.className)}
      alt="placeholder"
    />
  );
};

export { Image };
