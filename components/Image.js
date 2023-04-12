import { Image as CloudinaryImage } from "cloudinary-react";
import NextImage from "next/image";
import { Image as ImageIcon } from "react-feather";
import classNames from "classnames";

const Image = ({ alt, src, forceNextImage, quality = 20, ...props }) => {
  if (forceNextImage)
    return (
      <NextImage width="100%" height="100%" src={src} {...props} alt="image" />
    );

  if (typeof src === "string") {
    if (!src.includes("http")) {
      return (
        <CloudinaryImage
          cloudName={process.env.CLOUD_NAME}
          publicId={src}
          alt={alt}
          quality={quality}
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
