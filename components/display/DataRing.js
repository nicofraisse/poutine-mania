import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { ratingColors } from "data/ratingColors.js";
import Color from "color";

import classes from "./data-ring.module.scss";
import Image from "next/image";

export const DataRing = ({ icon, percent, iconWidth, noRatings }) => {
  const ringRef = useRef(null);
  const [percentValue, setPercentValue] = useState(0);

  useEffect(() => {
    const circle = ringRef.current;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.transition = "none";
    circle.style.strokeDashoffset = `${circumference}`;
    circle.getBoundingClientRect();
    circle.style.transition = "";
    const targetOffset = circumference - (percent / 100) * circumference;
    setTimeout(() => {
      circle.style.strokeDashoffset = `${targetOffset}`;
    }, 0);
    circle.classList.remove("opacity-0");
  }, [percent]);

  console.log({ percentValue, percent });

  useEffect(() => {
    if (percentValue < percent) {
      setTimeout(() => {
        setPercentValue((prev) => prev + 1);
      }, 12);
    }
  }, [percent, percentValue]);
  return (
    <div className="relative">
      <div className="absolute rounded-full flex items-center justify-center">
        <div className="absolute top-4" style={{ width: iconWidth }}>
          <Image
            src={icon}
            alt="data-ring-icon"
            width={iconWidth}
            height={iconWidth}
          />
          <div className="text-xs text-gray-500 absolute top-7 left-0 w-full text-center">
            {noRatings ? "?" : percentValue}%
          </div>
        </div>
        <svg width="72" height="73">
          <circle
            className={classNames(classes.ProgressRingCircle, "opacity-0")}
            ref={ringRef}
            stroke={Color(ratingColors[Math.floor(percentValue / 10)]).darken(
              0.4
            )}
            strokeWidth="5"
            fill="transparent"
            r="30"
            cx="36"
            cy="36"
          />
        </svg>
      </div>
      <div className="">
        <svg width="73" height="73">
          <circle
            className={classNames(classes.ProgressRingCircle, "")}
            stroke="#eee"
            strokeWidth="5"
            fill="transparent"
            r="30"
            cx="36"
            cy="36"
          />
        </svg>
      </div>
    </div>
  );
};
