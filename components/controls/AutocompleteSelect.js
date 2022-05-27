import axios from 'axios'
import { useField, useFormikContext } from 'formik'
import { AsyncPaginate } from 'react-select-async-paginate'

const AddressAutocompleteSelect = ({ onChange, value, ...props }) => {
  const [field] = useField(props)
  const { setFieldValue } = useFormikContext()

  const loadOptions = async (query) => {
    const { data } = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${'pk.eyJ1Ijoibmljb2ZyYWlzc2UiLCJhIjoiY2thZzZtemk3MDE4NzJybXVtMjF5a2xyOSJ9.6JURdkZj5FnZ5lxMzPncOA'}&autocomplete=true&types=address`
    )
    return {
      options: data?.features?.map((f) => {
        return { value: f, label: f.place_name }
      }),
    }
  }

  const handleChange = (data) => {
    onChange(data.value)
  }

  return (
    <AsyncPaginate
      loadOptions={loadOptions}
      onChange={handleChange}
      debounceTimeout={1000}
      className='text-sm'
      value={value}
      {...props}
    />
  )
}

export default AddressAutocompleteSelect
