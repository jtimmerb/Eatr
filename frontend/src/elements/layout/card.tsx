import React from "react";

interface IProps {
  children: React.ReactNode;
  padded?: boolean;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<IProps> = (props) => {
  const { children, padded, className, onClick } = props;

  return padded ? (
    <div
      className={`rounded-lg p-4 bg-white shadow-lg overflow-hidden ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  ) : (
    <div
      className={`rounded-xl bg-white shadow-lg overflow-hidden ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
