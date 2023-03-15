import { useEffect, useRef } from "react";

const useClickOutside = (func, options) => {
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      if (options?.stopPropagation) event.stopPropagation();
      if (options?.preventDefault) event.preventDefault();
      func();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  });

  return ref;
};

export default useClickOutside;
