import { useRef, useState } from "react";
import { Image } from "components/Image";
import { Camera, Trash } from "react-feather";
import { useField, useFormikContext } from "formik";
import classNames from "classnames";
import { isArray } from "lodash";

const ImageUpload = ({ roundedFull, ...props }) => {
  const [imageSrc, setImageSrc] = useState();
  const [field] = useField(props);
  const { setFieldValue } = useFormikContext();

  const handleChange = (changeEvent) => {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setFieldValue(field.name, changeEvent.target.files);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  };

  const inputRef = useRef();
  const handleDelete = () => {
    setImageSrc(undefined);
    setFieldValue(field.name, []);
  };

  const imageExists =
    imageSrc || isArray(field?.value) ? field?.value?.[0] : field?.value;
  return (
    <div>
      <input
        type="file"
        name="file"
        onChange={handleChange}
        hidden
        ref={inputRef}
      />
      <button type="button">
        {imageExists ? (
          <div
            className={classNames("relative inline-flex", {
              "border h-40": !roundedFull,
            })}
          >
            {imageSrc ? (
              <>
                {/* eslint-disable-next-line */}
                <img
                  src={imageSrc}
                  alt="upload"
                  className={classNames(
                    "h-full relative flex items-center justify-center",
                    {
                      "w-32 h-32 rounded-full object-cover object-center":
                        roundedFull,
                    }
                  )}
                ></img>
              </>
            ) : (
              <Image
                src={isArray(field?.value) ? field?.value?.[0] : field?.value}
                className={classNames({
                  "w-32 h-32 rounded-full object-cover object-center":
                    roundedFull,
                })}
                alt="existing-poutine-photo"
              />
            )}
            <button
              type="button"
              onClick={handleDelete}
              className="absolute top-[-10px] right-[-10px] border bg-white h-8 w-8 rounded-full hover:shadow flex items-center justify-center"
            >
              <Trash className="text-red-500" size={20} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current.click()}
            className={classNames(
              "border-dashed border-2 border-gray-200 w-32 h-32 text-gray-500 flex flex-col items-center justify-center hover:bg-gray-50 transition duration-100",
              {
                "rounded-full": roundedFull,
                "rounded-lg": !roundedFull,
              }
            )}
          >
            <Camera /> Ajouter
          </div>
        )}
      </button>
    </div>
  );
};

export default ImageUpload;
