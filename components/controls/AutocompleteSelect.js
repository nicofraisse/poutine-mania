import axios from "axios";
import { AsyncPaginate } from "react-select-async-paginate";

const AddressAutocompleteSelect = ({ onChange, value, ...props }) => {
  const loadOptions = async (query) => {
    const { data } = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${process.env.MAPBOX_API_KEY}&autocomplete=true&types=address`
    );
    return {
      options: data?.features?.map((f) => {
        return { value: f, label: f.place_name };
      }),
    };
  };

  const handleChange = (data) => {
    onChange(data.value);
  };

  return (
    <AsyncPaginate
      loadOptions={loadOptions}
      onChange={handleChange}
      debounceTimeout={1000}
      className="text-sm"
      value={value}
      {...props}
    />
  );
};

export default AddressAutocompleteSelect;
