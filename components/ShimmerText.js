import React from "react";

const ShimmerText = ({ children, className = "" }) => {
  return (
    <span
      className={`shimmer-text ${className}`}
      style={{
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
};

export default ShimmerText;
