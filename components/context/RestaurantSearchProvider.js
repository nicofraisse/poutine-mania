import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const RestaurantSearchContext = createContext({});

export const RestaurantSearchProvider = ({ children }) => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue] = useDebounce(searchValue, 250);
  const { query } = useRouter();

  useEffect(() => {
    // if (query.search) {
    setSearchValue(query?.search || "");
    // }
  }, [query]);

  return (
    <RestaurantSearchContext.Provider
      value={{
        searchValue: debouncedValue,
        setSearchValue,
        nonDebouncedValue: searchValue,
      }}
    >
      {children}
    </RestaurantSearchContext.Provider>
  );
};

export const useRestaurantSearch = () => {
  return useContext(RestaurantSearchContext);
};

export default RestaurantSearchContext;
