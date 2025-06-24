import classNames from "classnames";
import React from "react";
import { Spinner } from "./Spinner";

export const VariantColor = {
  primary: "primary",
  secondary: "secondary",
  secondaryWhite: "secondaryWhite",
  light: "light",
  white: "white",
  white2: "white2",
  lightLink: "lightLink",
  danger: "danger",
  blue: "blue",
  transparent: "transparent",
};

const bgColorClass = {
  [VariantColor.primary]: "bg-gradient-to-tr from-teal-700 to-teal-500",
  [VariantColor.blue]: "bg-gradient-to-tr from-blue-700 to-blue-400",
  [VariantColor.secondary]: "bg-none",
  [VariantColor.secondaryWhite]: "bg-none hover:bg-gray-400 bg-opacity-50",
  [VariantColor.light]: "bg-gradient-to-tr from-gray-200 to-gray-50",
  [VariantColor.white]: "bg-gradient-to-tr from-gray-100 to-white",
  [VariantColor.white2]: "bg-gradient-to-tr from-gray-200 to-white",
  [VariantColor.lightLink]: "bg-none",
  [VariantColor.danger]: "bg-gradient-to-tr from-red-600 to-red-400",
  [VariantColor.transparent]: "bg-gray-400 bg-opacity-50",
};

const hasBorder = {
  [VariantColor.primary]: false,
  [VariantColor.blue]: false,
  [VariantColor.secondary]: true,
  [VariantColor.secondaryWhite]: true,
  [VariantColor.light]: true,
  [VariantColor.white]: true,
  [VariantColor.white2]: true,
  [VariantColor.lightLink]: false,
  [VariantColor.danger]: false,
  [VariantColor.transparent]: false,
};

const borderClass = {
  [VariantColor.primary]: "",
  [VariantColor.blue]: "",
  [VariantColor.secondary]: "border-2 border-teal-600",
  [VariantColor.secondaryWhite]: "border-2 border-gray-200",
  [VariantColor.light]: "border-2 border-gray-200",
  [VariantColor.white]: "border-2 border-gray-500",
  [VariantColor.white2]: "border-2 border-gray-300",
  [VariantColor.lightLink]: "",
  [VariantColor.danger]: "",
};

const textColorClass = {
  [VariantColor.primary]: "text-white",
  [VariantColor.blue]: "text-white",
  [VariantColor.secondary]: "text-teal-700",
  [VariantColor.secondaryWhite]: "text-white",
  [VariantColor.light]: "text-gray-600",
  [VariantColor.white]: "text-gray-700",
  [VariantColor.white2]: "text-gray-500",
  [VariantColor.lightLink]: "text-gray-500 hover:text-gray-600",
  [VariantColor.danger]: "text-white",
  [VariantColor.transparent]: "text-white",
};

const heightClass = {
  sm: "h-[36px] xs:h-[40px]",
  smd: "h-[44px] xs:h-[48px]",
  md: "h-[52px] xs:h-[56px]",
  lg: "h-[52px] xs:h-[56px]",
};

const widthClass = {
  xs: "px-[8px] xs:px-[12px]",
  sm: "px-[12px] xs:px-[16px]",
  smd: "px-[16px] xs:px-[20px]",
  md: "px-[28px] xs:px-[32px]",
  lg: "px-[44px] xs:px-[48px]",
};

const Button = ({
  children,
  variant = "primary",
  loading,
  width = "sm",
  height = "md",
  className,
  disabled,
  rounded = false,
  ...props
}) => {
  const renderContent = () => {
    return (
      <>
        <div
          className={classNames(
            "flex items-center justify-center relative z-10",
            {
              "opacity-0": loading,
            }
          )}
        >
          {children}
        </div>

        {loading && (
          <div
            className="absolute w-full h-full flex items-center
           justify-center top-0 left-0 z-20"
          >
            <Spinner color={"#89a"} noPadding />
          </div>
        )}
      </>
    );
  };

  return (
    <button
      className={classNames(
        bgColorClass[variant],
        borderClass[variant],
        textColorClass[variant],
        heightClass[height],
        widthClass[width],

        "font-bold select-none relative transition-all duration-150",
        "active:scale-95",
        "before:content-[''] before:absolute before:inset-0 before:bg-black before:opacity-0 before:transition-opacity before:duration-150 hover:before:opacity-20",
        {
          "before:-m-0.5": hasBorder[variant],
          "opacity-50 cursor-not-allowed": disabled,
          "opacity-80": loading,
          "opacity-100": !loading,
          "rounded-full": rounded,
          "before:rounded-full": rounded,
          "rounded-lg": !rounded,
          "before:rounded-lg": !rounded,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
