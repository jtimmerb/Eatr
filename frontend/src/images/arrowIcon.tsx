import React from "react";

interface IProps {
  className?: string;
}

const ArrowIcon: React.FC<IProps> = (props) => (
  <svg
    className={props.className || ""}
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
  >
    <path d="M8.41667 15.7917L1.125 8.5M1.125 8.5L8.41667 1.20833M1.125 8.5H19.875" />
  </svg>
);

export default ArrowIcon;
