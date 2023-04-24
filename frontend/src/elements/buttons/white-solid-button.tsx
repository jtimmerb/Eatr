import React from "react";

interface IProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const WhiteSolidButton: React.FC<IProps> = ({ onClick, children, className }) => {
  return (
    <button
      className={`w-1/2 py-2 px-4 border border-transparent text-sm font-medium rounded-2xl text-red-400 bg-white ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default WhiteSolidButton;
