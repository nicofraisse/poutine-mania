import { Image as CloudinaryImage } from "cloudinary-react";
import NextImage from "next/image";
import { Image as ImageIcon } from "react-feather";
import classNames from "classnames";

const Image = ({ alt, src, forceNextImage, quality = 20, ...props }) => {
  const width = props.width;
  const height = props.height;

  if (forceNextImage)
    return (
      <NextImage
        src={src}
        alt="image"
        {...{
          ...(width && { width }),
          ...(height && { height }),
          ...(!width && { fill: true }),
          ...props,
        }}
      />
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
      <NextImage
        src={src}
        alt="image"
        fill={true}
        {...{
          ...(width && { width }),
          ...(height && { height }),
          ...props,
        }}
      />
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
