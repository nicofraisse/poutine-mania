import classNames from "classnames";
import React, { useEffect, useState } from "react";

export const ToggleSwitch = ({ onChange, checked }) => {
  const defaultChecked = checked ?? false;
  const [isChecked, setIsChecked] = useState(defaultChecked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = (checkedValue) => {
    setIsChecked((prev) => !prev);
    onChange && onChange(checkedValue);
  };

  return (
    <button
      onClick={() => handleChange(!isChecked)}
      className="flex items-center cursor-pointer"
    >
      <div className="relative w-[36px] h-[20px]">
        <input
          className="w-full h-full absolute top-0 left-0 pointer-events-none opacity-0"
          id="toggle-checkbox"
          type="checkbox"
          onChange={(e) => handleChange(e.target.checked)}
          checked={isChecked}
        />
        <div
          className={classNames(
            "w-100 h-100 transition-all duration-300 rounded-full flex items-center py-[2px]",
            { "bg-sky-700": isChecked, "bg-slate-300": !isChecked }
          )}
        >
          <div
            className={classNames(
              "w-[14px] h-[14px] transition-all duration-300 bg-white rounded-full",
              {
                "ml-[2px]": !isChecked,
                "ml-[20px]": isChecked,
              }
            )}
          />
        </div>
      </div>
    </button>
  );
};
