import React from "react";

interface IProps {
  onClose?: () => void;
  children?: React.ReactNode;
}

const Backdrop: React.FC<IProps> = (props) => {
  const { children, onClose } = props;

  return (
    <div className="fixed left-0 right-0 top-0 bottom-0 bg-[#00000088] z-50 inset-0 overflow-y-auto">
      <div
        className="absolute left-0 right-0 top-0 bottom-0"
        onClick={() => (onClose ? onClose() : null)}
      ></div>
      {children}
    </div>
  );
};

export default Backdrop;
