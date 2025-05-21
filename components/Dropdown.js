import classNames from "classnames";
import { createRef, useEffect } from "react";

const Dropdown = ({ children, isOpen, setIsOpen, toggleRef }) => {
  const ref = createRef();

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [ref, setIsOpen, toggleRef]);

  if (!isOpen) return null;

  return (
    <div
      className={classNames(
        "absolute bg-white border text-sm top-[52px] w-[160px] rounded-lg shadow-lg right-[0px]",
        classNames
      )}
      ref={ref}
    >
      {children}
    </div>
  );
};

export default Dropdown;
