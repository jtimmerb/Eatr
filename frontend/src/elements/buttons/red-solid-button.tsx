import React from "react";

interface IProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  buttonType?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const RedSolidButton: React.FC<IProps> = (props) => {
  const { onClick, children, className, disabled, buttonType } = props;
  return (
    <button
      className={`w-52 py-2 disabled:opacity-50 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-red-400 shadow-md ${className}`}
      onClick={(event) => {
        event.preventDefault();
        if (onClick) onClick();
      }}
      disabled={disabled}
      type={buttonType || "button"}
    >
      {children}
    </button>
  );
};

export default RedSolidButton;
