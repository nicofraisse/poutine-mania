import classNames from "classnames";
import React from "react";
import Spinner from "./Spinner";

export const VariantColor = {
  primary: "primary",
  secondary: "secondary",
  light: "light",
  white: "white",
  white2: "white2",
  lightLink: "lightLink",
  danger: "danger",
  blue: "blue",
};

const bgColorClass = {
  [VariantColor.primary]: "bg-teal-600",
  [VariantColor.blue]: "bg-blue-500",
  [VariantColor.secondary]: "bg-none",
  [VariantColor.light]: "bg-gray-100",
  [VariantColor.white]: "bg-white",
  [VariantColor.white2]: "bg-white",
  [VariantColor.lightLink]: "bg-none",
  [VariantColor.danger]: "bg-red-500",
};

const bgColorHoverClass = {
  [VariantColor.primary]: "",
  [VariantColor.blue]: "",
  [VariantColor.secondary]: "",
  [VariantColor.light]: "hover:bg-gray-200",
  [VariantColor.white]: "",
  [VariantColor.white2]: "",
  [VariantColor.lightLink]: "bg-danger-600",
};

const borderClass = {
  [VariantColor.primary]: "",
  [VariantColor.blue]: "",
  [VariantColor.secondary]: "border-2 border-teal-600",
  [VariantColor.light]: "border-2 border-gray-100",
  [VariantColor.white]: "border-2 border-gray-500",
  [VariantColor.white2]: "border-2 border-gray-300",
  [VariantColor.lightLink]: "",
};

const textColorClass = {
  [VariantColor.primary]: "text-white",
  [VariantColor.blue]: "text-white",
  [VariantColor.secondary]: "text-teal-600",
  [VariantColor.light]: "text-gray-500",
  [VariantColor.white]: "text-gray-600",
  [VariantColor.white2]: "text-gray-400",
  [VariantColor.lightLink]: "text-gray-400 hover:text-gray-500",
  [VariantColor.danger]: "text-white",
};

const heightClass = {
  sm: "h-[40px]",
  smd: "h-[48px]",
  md: "h-[56px]",
  lg: "h-[56px]",
};

const widthClass = {
  xs: "px-2",
  sm: "px-3",
  smd: "px-4",
  md: "px-8",
  lg: "px-12",
};

const Button = ({
  children,
  variant = "primary",
  loading,
  width = "sm",
  height = "md",
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={classNames(
        bgColorClass[variant],
        bgColorHoverClass[variant],
        borderClass[variant],
        textColorClass[variant],
        heightClass[height],
        widthClass[width],
        "rounded-md font-bold select-none relative transition-colors duration-150",
        {
          "opacity-50 cursor-not-allowed": disabled,
          "opacity-80": loading,
          "opacity-100": !loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <div
        className={classNames("flex items-center justify-center", {
          "opacity-0": loading,
        })}
      >
        {children}
      </div>
      {loading && (
        <div
          className="absolute w-full h-full flex items-center
         justify-center top-0 left-0"
        >
          <Spinner color={"#89a"} noPadding />
        </div>
      )}
    </button>
  );
};

export default Button;
