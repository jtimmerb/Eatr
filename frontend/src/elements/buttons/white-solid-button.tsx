import React from "react";

interface IProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const WhiteSolidButton: React.FC<IProps> = (props) => {
  const { onClick, children, className, disabled } = props;
  return (
    <button
      className={`w-52 py-2 px-4 border border-transparent text-sm font-medium rounded-full text-red-400 bg-white shadow-md ${className}`}
      onClick={(event) => {
        event.preventDefault();
        if (onClick) onClick();
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default WhiteSolidButton;
