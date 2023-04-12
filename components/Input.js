import classNames from "classnames";
import { lowerCase } from "lodash";

const Input = ({ value, type, className, ...props }) => {
  const placeholder =
    props.placeholder || `Enter ${lowerCase(props.name)} here`;
  if (type === "textarea") {
    return (
      <textarea
        className={classNames(
          "text-sm xs:text-base border-2 border-gray-300 font-light rounded-md py-[8px] px-2 w-full h-[140px]",
          className
        )}
        placeholder={placeholder}
        defaultValue={value}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      className={classNames(
        "border-2 border-gray-300 rounded-md py-[8px] px-2 text-sm w-full truncate break-all",
        className
      )}
      placeholder={placeholder}
      defaultValue={value}
      {...props}
    />
  );
};

export default Input;
