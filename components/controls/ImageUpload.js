import React, { useEffect, useRef, useState } from "react";
import { Image } from "components/Image";
import { Camera, Trash } from "react-feather";
import { useField, useFormikContext } from "formik";
import classNames from "classnames";
import { compressImage } from "lib/compressImage";
import { isArray, isString } from "lodash";
import { useTranslation } from "next-i18next";

const ImageUpload = ({
  roundedFull,
  maxImages = 5,
  isMulti = false,
  ...props
}) => {
  const [imageSrcs, setImageSrcs] = useState([]);
  const [field] = useField(props);
  const [dragging, setDragging] = useState(false);
  const { t } = useTranslation();

  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    const values = Array.isArray(field.value) ? field.value : [field.value];
    setImageSrcs(values.filter((v) => isString(v)));
  }, []);

  const handleChange = async (changeEvent) => {
    const files = Array.from(changeEvent.target.files);
    const newImageSrcs = isMulti ? [...imageSrcs] : [];

    for (const file of files) {
      const compressedFile = await compressImage(file);
      const reader = new FileReader();

      reader.onload = function (onLoadEvent) {
        newImageSrcs.push(onLoadEvent.target.result);

        setImageSrcs(newImageSrcs);
        setFieldValue(
          field.name,
          isMulti ? [...field.value, compressedFile] : [compressedFile]
        );
      };

      reader.readAsDataURL(compressedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleChange({ target: { files: e.dataTransfer.files } });
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const inputRef = useRef();

  const handleDelete = (index) => {
    inputRef.current && (inputRef.current.value = "");

    const newImageSrcs = [...imageSrcs];
    newImageSrcs.splice(index, 1);
    setImageSrcs(newImageSrcs);
    if (isArray(field.value)) {
      const newValue = [...field.value];
      newValue.splice(index, 1);
      setFieldValue(field.name, newValue);
    } else if (isString(field.value)) {
      setFieldValue(field.name, "null");
    }
  };

  return (
    <div className="flex flex-wrap items-start">
      {imageSrcs.map((src, index) => (
        <div
          key={index}
          className={classNames("relative inline-flex m-2", {
            "": !roundedFull,
          })}
        >
          {src?.includes("data") ? (
            <img
              src={src}
              alt="upload"
              className={classNames("w-32 h-32 object-cover object-center", {
                "rounded-full": roundedFull,
                "rounded-lg": !roundedFull,
              })}
            ></img>
          ) : (
            <Image
              src={src}
              alt="upload"
              className={classNames("w-32 h-32 object-cover object-center", {
                "rounded-full": roundedFull,
                "rounded-lg": !roundedFull,
              })}
            ></Image>
          )}
          <button
            type="button"
            onClick={() => handleDelete(index)}
            className={classNames(
              "absolute border bg-white h-8 w-8 rounded-full hover:shadow flex items-center justify-center",
              {
                "top-[-10px] right-[-10px]": !roundedFull,
                "top-[-0px] right-[-8px]": roundedFull,
              }
            )}
          >
            <Trash className="text-red-500" size={20} />
          </button>
        </div>
      ))}
      {(isMulti ? imageSrcs.length < maxImages : imageSrcs.length === 0) && (
        <div
          className={classNames("m-2 rounded-lg", {
            "border-gray-300 bg-sky-100": dragging,
          })}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            name="file"
            onChange={handleChange}
            hidden
            ref={inputRef}
            multiple={isMulti}
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
              <Camera /> {t("button.add")}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
