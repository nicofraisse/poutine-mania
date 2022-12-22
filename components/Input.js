import classNames from "classnames";
import { lowerCase } from "lodash";
import { Search } from "react-feather";
import Spinner from "./Spinner";

const Input = ({
  className,
  value,
  type,
  isSearch,
  loading,
  handleSearch,
  ...props
}) => {
  const placeholder =
    props.placeholder || `Enter ${lowerCase(props.name)} here`;
  if (type === "textarea") {
    return (
      <textarea
        className="text-sm xs:text-base border-2 border-gray-300 font-light rounded-md py-[8px] px-2 w-full h-[140px]"
        placeholder={placeholder}
        defaultValue={value}
        {...props}
      />
    );
  }
  if (isSearch) {
    return (
      <div className={classNames("relative", className)}>
        <input
          type={type}
          className="border-2 border-gray-300 rounded-md py-[8px] px-2 text-sm w-full"
          placeholder={placeholder}
          defaultValue={value}
          value={value}
          {...props}
        />
        {loading ? (
          <Spinner
            className="absolute top-2 right-2 text-gray-400 w-6"
            color={"#aaa"}
            noPadding
          />
        ) : (
          <Search
            className="absolute top-2 right-2 text-gray-400 cursor-pointer hover:text-gray-500 transition duration-300"
            onClick={handleSearch}
          />
        )}
      </div>
    );
  }

  return (
    <input
      type={type}
      className="border-2 border-gray-300 rounded-md py-[8px] px-2 text-sm w-full truncate break-all"
      placeholder={placeholder}
      defaultValue={value}
      {...props}
    />
  );
};

export default Input;
