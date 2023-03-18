import React, { useEffect, useRef, useState } from "react";
import { Image } from "components/Image";
import { Camera, Trash } from "react-feather";
import { useField, useFormikContext } from "formik";
import classNames from "classnames";
import { isString } from "lodash";
import { compressImage } from "lib/compressImage";

const ImageUpload = ({ roundedFull, maxImages = 5, ...props }) => {
  const [imageSrcs, setImageSrcs] = useState([]);
  const [field] = useField(props);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setImageSrcs(field.value.filter((v) => isString(v)));
  }, []);

  const handleChange = async (changeEvent) => {
    const files = Array.from(changeEvent.target.files);
    const newImageSrcs = [...imageSrcs];

    for (const file of files) {
      const compressedFile = await compressImage(file);
      const reader = new FileReader();

      reader.onload = function (onLoadEvent) {
        newImageSrcs.push(onLoadEvent.target.result);

        setImageSrcs(newImageSrcs);
        setFieldValue(field.name, [...field.value, compressedFile]);
      };

      reader.readAsDataURL(compressedFile);
    }
  };

  const inputRef = useRef();

  const handleDelete = (index) => {
    const newImageSrcs = [...imageSrcs];
    newImageSrcs.splice(index, 1);
    setImageSrcs(newImageSrcs);

    const newValue = [...field.value];
    newValue.splice(index, 1);
    setFieldValue(field.name, newValue);
  };

  return (
    <div className="flex flex-wrap">
      {imageSrcs.map((src, index) => (
        <div
          key={index}
          className={classNames("relative inline-flex m-2", {
            "border h-40": !roundedFull,
          })}
        >
          {src.includes("data") ? (
            <img
              src={src}
              alt="upload"
              className={classNames(
                "h-full relative flex items-center justify-center",
                {
                  "w-32 h-32 rounded-full object-cover object-center":
                    roundedFull,
                }
              )}
            ></img>
          ) : (
            <Image
              src={src}
              alt="upload"
              className={classNames(
                "h-full relative flex items-center justify-center",
                {
                  "w-32 h-32 rounded-full object-cover object-center":
                    roundedFull,
                }
              )}
            ></Image>
          )}
          <button
            type="button"
            onClick={() => handleDelete(index)}
            className="absolute top-[-10px] right-[-10px] border bg-white h-8 w-8 rounded-full hover:shadow flex items-center justify-center"
          >
            <Trash className="text-red-500" size={20} />
          </button>
        </div>
      ))}
      {imageSrcs.length < maxImages && (
        <div className="m-2">
          <input
            type="file"
            name="file"
            onChange={handleChange}
            hidden
            ref={inputRef}
            multiple
          />
          <button type="button">
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
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
