import React from "react";

interface IProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const RedSolidButton: React.FC<IProps> = ({ onClick, children, className }) => {
  return (
    <button
      className={`w-52 py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-red-400 shadow-md ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default RedSolidButton;
