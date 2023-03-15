import { useField, useFormikContext } from "formik";
import Select from "react-select";
import { isString } from "lodash";

const CategorySelect = ({ onChange, value, ...props }) => {
  const [field] = useField(props);
  const { setFieldValue } = useFormikContext();

  const handleChange = (data) => {
    setFieldValue(field.name, data);
  };

  const options = [
    "Restaurant",
    "Diner",
    "Bar",
    "Pub",
    "Fast-food",
    "Auberge",
    "Casse-croûte",
  ].map((o) => {
    return { label: o, value: o };
  });

  const convertToOptions = (values) => {
    return values.map((v) => {
      if (isString(v))
        return {
          label: v,
          value: v,
        };
      return v;
    });
  };

  return (
    <Select
      isMulti={true}
      onChange={handleChange}
      options={options}
      value={convertToOptions(value)}
      className="text-sm"
      {...props}
    />
  );
};

export default CategorySelect;
