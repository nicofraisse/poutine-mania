import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useEffect, useState } from "react";
import { useField, useFormikContext } from "formik";

const Phone = (props) => {
  // `value` will be the parsed phone number in E.164 format.
  // Example: "+12133734253".
  const [value, setValue] = useState();
  const [field] = useField(props);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setFieldValue(field.name, value);
  }, [value]);

  return (
    <div className="border border-gray-300 rounded pl-3 pr-1 py-1">
      <PhoneInput
        placeholder="Entrez le numéro de téléphone"
        value={value}
        onChange={setValue}
        defaultCountry="CA"
        style={{ outline: "none" }}
      />
    </div>
  );
};

export default Phone;
