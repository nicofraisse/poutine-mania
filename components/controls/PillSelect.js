import classNames from "classnames";
import { useField, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";

const Pill = ({ caption, isSelected, onClick }) => {
  return (
    <div
      className={classNames(
        "shadow py-1 px-3 mr-2 mb-2 select-none rounded cursor-pointer transition-colors duration-200",
        {
          "bg-purple-100 text-gray-600": !isSelected,
          "bg-purple-500 text-white": isSelected,
        }
      )}
      onClick={onClick}
    >
      {caption}
    </div>
  );
};

const PillSelect = ({ options, onChange, isMulti, value, ...props }) => {
  const [selectedValues, setSelectedValues] = useState(isMulti ? [] : null);
  const [field] = useField(props);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setFieldValue(field.name, selectedValues);
  }, [selectedValues]);

  console.log(selectedValues);
  const handleSelect = (value) => {
    if (isMulti) {
      if (selectedValues.includes(value)) {
        setSelectedValues(selectedValues.filter((v) => v !== value));
      } else setSelectedValues([...selectedValues, value]);
    } else {
      setSelectedValues(selectedValues === value ? null : value);
    }
  };

  return (
    <div className="flex flex-wrap">
      {options.map((o) => (
        <Pill
          key={o.value}
          onClick={() => handleSelect(o.value)}
          caption={o.label}
          isSelected={
            isMulti
              ? selectedValues.includes(o.value)
              : selectedValues === o.value
          }
        />
      ))}
    </div>
  );
};

export default PillSelect;
