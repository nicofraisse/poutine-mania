import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { ratingColors } from "data/ratingColors";
import Color from "color";
import { round } from "lodash";

import classes from "./data-ring.module.scss";
import Image from "next/image";

export const DataRing = ({ size, icon, percent, iconStyle, unknown }) => {
  const ringRef = useRef(null);
  const [percentValue, setPercentValue] = useState(0);

  useEffect(() => {
    ringRef.current.classList.remove("opacity-0");
    const radius = ringRef.current.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    ringRef.current.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (percent / 100) * circumference;
    ringRef.current.style.strokeDashoffset = 180;
    setTimeout(() => {
      ringRef.current.style.strokeDashoffset = offset;
    });
  }, [percent]);

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
        {/* <Icon className="absolute" color={iconColor} /> */}
        <div className="absolute top-4" style={iconStyle}>
          <Image src={icon} alt="data-ring-icon" />
          <div className="text-xs text-gray-500 absolute top-7 left-0 w-full text-center">
            {unknown ? "?" : percentValue}%
          </div>
        </div>
        <svg width="72" height="73">
          <circle
            className={classNames(classes.ProgressRingCircle, "opacity-0")}
            ref={ringRef}
            stroke={Color(ratingColors[round(percentValue / 10)]).darken(0.4)}
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
            // ref d={ringRef}
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
