import classNames from "classnames";
import { useField, useFormikContext } from "formik";
import { useEffect, useRef, useState } from "react";
import { ratingColors } from "../../data/ratingColors";
import { round } from "lodash";
import Color from "color";
import { X } from "react-feather";

const ratingCaptions = [
  "Horrible!",
  "Dégueulasse",
  "Mauvais",
  "Médiocre",
  "Moyen",
  "Assez bon",
  "Bon",
  "Très bon",
  "Excellent",
  "Exquis!",
];

const RatingButtons = ({ ...props }) => {
  const [field] = useField(props);
  const { setFieldValue } = useFormikContext();
  const [isHoveredNumber, setIsHoveredNumber] = useState(null);
  const [isClickedNumber, setIsClickedNumber] = useState(null);

  const handleClick = (n) => {
    setFieldValue(field.name, n);
    setIsClickedNumber(n);
  };

  useEffect(() => {
    if (!!isClickedNumber && field.value === null) setIsClickedNumber(null);
  }, [field, setFieldValue, isClickedNumber]);

  useEffect(() => {
    if (field.value !== null) setIsClickedNumber(field.value);
  }, [field]);

  return (
    <div className="flex items-center relative mb-2 pt-1">
      {[...Array(10)].map((_, i) => {
        const color = (defaultColor) =>
          isHoveredNumber
            ? i < isHoveredNumber
              ? Color(ratingColors[i + 1]).darken(0.25)
              : defaultColor
            : isClickedNumber && i < isClickedNumber
            ? Color(ratingColors[i + 1]).darken(0.25)
            : defaultColor;
        return (
          <div
            key={i}
            onMouseEnter={() => setIsHoveredNumber(i + 1)}
            onMouseLeave={() => setIsHoveredNumber(null)}
            className="h-[28px] w-[30px] cursor-pointer"
            onClick={() => handleClick(i + 1)}
          >
            <div
              className="h-full w-[28px] rounded-full bg-gray-300 flex items-center justify-center"
              style={{
                backgroundColor: color("white"),

                border: `1px solid ${color("#ddd")}`,
              }}
            >
              <span className="text-white font-bold text-lg">
                {isHoveredNumber
                  ? isHoveredNumber === i + 1 && isHoveredNumber
                  : isClickedNumber === i + 1
                  ? isClickedNumber
                  : ""}
                {isHoveredNumber === null && isClickedNumber === null && (
                  <span className="text-gray-100">{i + 1}</span>
                )}
              </span>
            </div>
          </div>
        );
      })}
      {ratingCaptions[isClickedNumber - 1] && (
        <X
          className="text-gray-300 hover:text-gray-500 ml-3 cursor-pointer"
          size={22}
          onClick={() => handleClick(null)}
        />
      )}
      {/* {!!(ratingCaptions[isHoveredNumber - 1] || ratingCaptions[isClickedNumber - 1]) && (
        <div className='flex items-center absolute -top-6 right-12'>
          <div
            className='text-white rounded ml-2  h-full flex items-center w-[100px] justify-center'
            style={{
              backgroundColor: Color(
                ratingColors[isHoveredNumber - 1] || ratingColors[isClickedNumber - 1]
              ).darken(0.4),
            }}
          >
            {ratingCaptions[isHoveredNumber - 1] || ratingCaptions[isClickedNumber - 1]}
          </div>
          {ratingCaptions[isClickedNumber - 1] && (
            <X
              className='text-gray-300 hover:text-gray-500 ml-2 cursor-pointer'
              size={22}
              onClick={() => handleClick(null)}
            />
          )}
        </div>
      )} */}
    </div>
  );
};

export default RatingButtons;
